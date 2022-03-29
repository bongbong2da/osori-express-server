import express from 'express';
import FirebaseApp from '../firebase/FirebaseApp';
import { messaging } from 'firebase-admin';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { trimNull } from '../utils/objectUtil';
import sequelize from '../models';

const ScrapRouter = express.Router();
const Scrap = sequelize.scrap;
const User = sequelize.user;
const Article = sequelize.article;

FirebaseApp();

const msg = messaging();

ScrapRouter.post('/scrap/:articleId', async (req, res) => {
  try {
    // @ts-ignore
    const scrapper = jwt.decode((req.header('Authorization') as string).split(' ')[1]).user as user;
    const articleId = Number(req.params.articleId);
    const userExists = await User.findOne({ where: { id: scrapper.id } });
    if (!userExists) {
      throw { code: 500, message: '잘못된 사용자입니다' };
    }
    const exists = await userExists.getScraps();
    if (_.find(exists, { articleId })) {
      throw { code: 409, message: '이미 스크랩한 글입니다' };
    } else {
      Scrap.create({ userId: scrapper.id, articleId })
        .then(async (result) => {
          await Article.findOne({ where: { id: articleId } }).then(async (article) => {
            if (article) {
              await User.findOne({ where: { id: article.creatorId } }).then(async (user) => {
                if (user && user.pushToken) {
                  msg.send({
                    token: user.pushToken,
                    notification: {
                      title: `${scrapper.nickname}님이 회원님의 글을 스크랩하였습니다`,
                    },
                  });
                }
              });
            }
          });

          res.send(result.get());
        })
        .catch(() => {
          throw { code: 500, message: 'server error' };
        });
    }
  } catch (e: any) {
    res.status(e.code || 500);
    res.send(e.message || e);
    console.log(e);
  }
});

ScrapRouter.delete('/scrap/:articleId', (req, res) => {
  try {
    // @ts-ignore
    const scrapper = jwt.decode((req.header('Authorization') as string).split(' ')[1]).user as user;
    const articleId = Number(req.params.articleId);
    Scrap.destroy({ where: { userId: scrapper.id, articleId } }).then((result) => {
      switch (result) {
        case 0:
          res.send('스크랩하지 않은 글입니다');
          break;
        case 1:
          res.send('스크랩을 해제했습니다');
          break;
        default:
          res.status(500);
          res.send('server error');
      }
    });
  } catch (e: any) {
    console.log(e);
    res.status(e.code || 500);
    res.send(e.message || e);
  }
});

ScrapRouter.get('/scraps/:userId', async (req, res) => {
  const targetUserId = Number(req.params.userId);
  const targetUser = await User.findOne({ where: { id: targetUserId } });
  if (!targetUser) {
    res.status(500);
    res.send('사용자 정보를 찾을 수 없습니다');
  } else {
    const scraps = await targetUser.getScraps();
    const payload = await Promise.all(
      scraps.map(async (scrap) => {
        const article = await scrap.getArticle();
        return trimNull(article.get());
      }),
    );
    res.send(payload);
  }
});

export default ScrapRouter;
