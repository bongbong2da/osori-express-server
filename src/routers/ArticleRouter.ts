import express from 'express';
import { isUndefined } from 'lodash';
import { makeFilter, makePagination, trimNull } from '../utils/objectUtil';
import { ArticleDto } from '../payloads/payloads';
import sequelize from '../models';
import { user } from '../models/user';
import { article } from '../models/article';

const ArticleRouter = express.Router();
const Article = sequelize.article;
const User = sequelize.user;

/**
 * @getArticle
 */
ArticleRouter.get('/article/:articleId', (req, res) => {
  const { articleId } = req.params;
  if (!isUndefined(articleId)) {
    Article.findOne({ where: { id: articleId } }).then(async (article) => {
      if (article) {
        const creator = await User.findOne({ where: { id: article.creatorId } });
        if (creator) {
          const payload : ArticleDto = {
            ...trimNull(article.get()),
            creator: trimNull(creator.get()),
          };
          // @ts-ignore
          delete payload.creatorId;
          res.send(payload);
        } else {
          res.send(article);
        }
      } else {
        res.send('ARTICLE_NOT_FOUND');
      }
    }).catch((e) => {
      console.log(e);
      res.send('SERVER_ERROR');
    });
  }
});

/**
 * @getArticlesByUserId
 */
ArticleRouter.get('/articles', async (req, res) => {
  const { filter, offset } = makeFilter(req.query);

  await Article.findAndCountAll({ offset, limit: filter.size, order: [['id', 'DESC']] })
    .then(async (result) => {
      const { count, rows } = result;
      if (rows) {
        const payloads = await Promise.all(rows.map(async (article) => {
          const creator = await article.getCreator().catch((e) => {
            res.status(500);
            res.send(e);
          });

          if (creator) {
            const payload = {
              ...trimNull(article.get()),
              creator: trimNull(creator.get()),
            };
            delete payload.creatorId;
            return payload;
          }
          return article;
        }));
        const pagination = makePagination(filter, rows.length, count);
        res.setHeader('X-Pagination', pagination);
        res.send(payloads);
      } else {
        res.send([]);
      }
    })
    .catch((e) => {
      res.send('SERVER_ERROR');
    });
});

/**
 * @getArticlesByUserId
 */
ArticleRouter.get('/articles/:creatorId', async (req, res) => {
  const { filter, offset } = makeFilter(req.query);
  const creatorId = Number(req.params.creatorId);

  const user = await User.findOne({ where: { id: creatorId } });
  if (user) {
    await Article.findAndCountAll({ offset, limit: filter.size, order: [['id', 'DESC']] }).then(async (result) => {
      const { count, rows } = result;
      const pagination = makePagination(filter, rows.length, count);

      if (rows) {
        const payloads = await Promise.all(rows.map(async (article) => {
          const creator = await article.getCreator().catch((e) => {
            res.status(500);
            res.send(e);
          });

          if (creator) {
            const payload = {
              ...trimNull(article.get()),
              creator: trimNull(creator.get()),
            };
            delete payload.creatorId;
            return payload;
          }
          return article;
        }));
        res.setHeader('X-Pagination', pagination);
        res.send(payloads);
      } else {
        res.send([]);
      }
    });
  } else {
    res.status(400);
    res.send('사용자를 찾을 수 없습니다.');
  }
});

/**
 * @createArticle
 */
ArticleRouter.post('/article', async (req, res) => {
  const creatingArticle = req.body as article;
  const creator = user.findOne({ where: { id: creatingArticle.creatorId } });
  if (creator === null) {
    res.send('user not found');
    return;
  }

  console.log('creating', creatingArticle);
  Article.create(creatingArticle).then((result) => {
    console.log('success');
    res.send(result);
  }).catch((e) => {
    console.log(e);
    console.log('failed');
    res.send(null);
  });
});

/**
 * @updateArticle
 */
ArticleRouter.put('/article/:articleId', (req, res) => {
  const { articleId } = req.params;
  const updatingArticle = req.body as user;
  if (Number(articleId) !== updatingArticle.id) {
    console.log('id doesn\'t match');
    res.send('failed');
    return;
  }
  console.log('updating', updatingArticle);
  Article.update(updatingArticle, { where: { id: articleId } }).then((result) => {
    console.log('success');
    res.send(result);
  }).catch((e) => {
    console.log(e);
    console.log('failed');
    res.send(null);
  });
});

/**
 * @deleteArticle
 */
ArticleRouter.delete('/article/:articleId', (req, res) => {
  const { articleId } = req.params;
  console.log('deleting', articleId);
  Article.destroy({ where: { id: articleId } }).then((result) => {
    console.log('deleted');
    res.status(200);
    res.send(result);
  }).catch((e) => {
    res.status(500);
    res.send(e);
  });
});

export default ArticleRouter;
