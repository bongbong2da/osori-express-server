import express from 'express';
import { messaging } from 'firebase-admin';
import _, { isUndefined } from 'lodash';
import FirebaseApp from '../firebase/FirebaseApp';
import sequelize from '../models';
import { article } from '../models/article';
import { user } from '../models/user';
import { ArticleDto } from '../payloads/payloads';
import { getCaller, makeFilter, makePagination, trimNull } from '../utils/objectUtil';

const ArticleRouter = express.Router();
const Article = sequelize.article;
const User = sequelize.user;
const Follow = sequelize.follow;

FirebaseApp();

const msg = messaging();

/**
 * @getArticle
 */
ArticleRouter.get('/article/:articleId', async (req, res) => {
  // @ts-ignore
  const caller = await getCaller(req.header('Authorization'));

  const { articleId } = req.params;
  if (!isUndefined(articleId)) {
    Article.findOne({ where: { id: articleId } })
      .then(async (article) => {
        if (article) {
          const creator = await User.findOne({ where: { id: article.creatorId } });
          if (creator) {
            const followerCount = await Follow.count({ where: { followee: creator.id } });

            const payload: ArticleDto = {
              ...trimNull(article.get()),
              creator: { ...trimNull(creator.get()), followerCount },
            };

            if (caller) {
              const scrapped = await caller.getScraps();
              console.log(scrapped);
              const isScrapped = _.find(scrapped, (scrap) => scrap.get().articleId === article.id);
              if (isScrapped) {
                payload.isScrapped = true;
              }
            }

            // 본인 글인지 플래그 false일 시 포함하지 않음
            if (typeof caller !== 'undefined') {
              const isMine = creator.id === caller?.id;
              if (isMine) {
                payload.isMine = isMine;
              }
            }

            // 작성자 아이디 미포함
            // @ts-ignore
            delete payload.creatorId;
            res.send(payload);
          } else {
            res.send(article);
          }
        } else {
          res.send('ARTICLE_NOT_FOUND');
        }
      })
      .catch((e) => {
        console.log(e);
        res.send('SERVER_ERROR');
      });
  }
});

/**
 * @getArticles
 */
ArticleRouter.get('/articles', async (req, res) => {
  const { filter, offset } = makeFilter(req.query);
  const caller = await getCaller(req.header('Authorization'));

  await Article.findAndCountAll({ offset, limit: filter.size, order: [['id', 'DESC']] })
    .then(async (result) => {
      const { count, rows } = result;
      if (rows) {
        const payloads = await Promise.all(
          rows.map(async (article) => {
            const creator = await article.getCreator().catch((e) => {
              res.status(500);
              res.send(e);
            });

            if (creator) {
              const follows = await Follow.findAndCountAll({ where: { followee: creator.id } });

              const payload: ArticleDto = {
                ...trimNull(article.get()),
                creator: {
                  ...trimNull(creator.get()),
                  followerCount: follows.count,
                },
              };

              // isFollowing
              const isFollowing = _.find(follows.rows, { follower: caller?.id });
              if (isFollowing) {
                payload.creator.isFollowing = true;
              }

              // isScrapped
              if (caller) {
                const scrapped = await caller.getScraps();
                console.log(scrapped);
                const isScrapped = _.find(
                  scrapped,
                  (scrap) => scrap.get().articleId === article.id,
                );
                if (isScrapped) {
                  payload.isScrapped = true;
                }
              }

              // isMine
              if (typeof caller !== 'undefined') {
                const isMine = creator.id === caller.id;
                if (isMine) {
                  payload.isMine = isMine;
                }
              }

              // 작성자 아이디 미포함
              // @ts-ignore
              delete payload.creatorId;
              return payload;
            }
            return article;
          }),
        );
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
  try {
    const { filter, offset } = makeFilter(req.query);
    const caller = await getCaller(req.header('Authorization'));
    const creatorId = Number(req.params.creatorId);

    const user = await User.findOne({ where: { id: creatorId } });
    if (user) {
      await Article.findAndCountAll({
        offset,
        limit: filter.size,
        where: { creatorId },
        order: [['id', 'DESC']],
      }).then(async (result) => {
        const { count, rows } = result;
        const pagination = makePagination(filter, rows.length, count);

        if (rows) {
          const payloads = await Promise.all(
            rows.map(async (article) => {
              const creator = await article.getCreator().catch((e) => {
                res.status(500);
                res.send(e);
              });

              if (creator) {
                const follows = await Follow.findAndCountAll({ where: { followee: creator.id } });

                const payload: ArticleDto = {
                  ...trimNull(article.get()),
                  creator: {
                    ...trimNull(creator.get()),
                    followerCount: follows.count,
                  },
                };

                // isFollowing
                const isFollowing = _.find(follows.rows, { follower: caller?.id });
                if (isFollowing) {
                  payload.creator.isFollowing = true;
                }

                if (caller) {
                  const scrapped = await caller.getScraps();
                  console.log(scrapped);
                  const isScrapped = _.find(
                    scrapped,
                    (scrap) => scrap.get().articleId === article.id,
                  );
                  if (isScrapped) {
                    payload.isScrapped = true;
                  }
                }

                if (typeof caller !== 'undefined') {
                  const isMine = creator.id === caller.id;
                  if (isMine) {
                    payload.isMine = isMine;
                  }
                }

                // @ts-ignore
                delete payload.creatorId;
                return payload;
              }
              return article;
            }),
          );
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
  } catch (e) {
    console.log(e);
    res.status(500);
    res.send('server error');
  }
});

/**
 * @createArticle
 */
ArticleRouter.post('/article', async (req, res) => {
  try {
    const creatingArticle = req.body as article;
    const creator = await User.findOne({ where: { id: creatingArticle.creatorId } });
    if (!creator) {
      res.send('user not found');
      return;
    }

    console.log('creating', creatingArticle);
    Article.create(creatingArticle)
      .then(async (result) => {
        creator.getFollows().then((follows) => {
          if (follows) {
            follows.forEach((follow) => {
              follow.getFollowerUser().then((user) => {
                if (user && user.pushToken) {
                  msg.send({
                    token: user.pushToken,
                    notification: {
                      title: `${creator.nickname}님이 새 글을 작성하였습니다`,
                    },
                  });
                }
              });
            });
          }
        });

        console.log('success');
        res.send(result);
      })
      .catch((e) => {
        console.log(e);
        console.log('failed');
        res.send(null);
      });
  } catch (e) {
    console.log(e);
    res.status(500);
    res.send('server error');
  }
});

/**
 * @updateArticle
 */
ArticleRouter.put('/article/:articleId', async (req, res) => {
  const { articleId } = req.params;
  const updatingArticle = req.body as ArticleDto;

  const caller = await getCaller(req.get('Authorization'));

  // 작성자가 수정하고 있는지
  if (caller) {
    if (caller.id !== updatingArticle.creator.id) {
      res.status(400);
      res.send('작성자 본인이 아닙니다.');
      return;
    }
  }

  // 정확한 번호의 글을 수정하고있는지
  if (Number(articleId) !== updatingArticle.id) {
    console.log("id doesn't match");
    res.send('failed');
    return;
  }
  console.log('updating', updatingArticle);
  Article.update(updatingArticle, { where: { id: articleId } })
    .then((result) => {
      console.log('success');
      res.send(result);
    })
    .catch((e) => {
      console.log(e);
      console.log('failed');
      res.send(null);
    });
});

/**
 * @deleteArticle
 */
ArticleRouter.delete('/article/:articleId', async (req, res) => {
  const { articleId } = req.params;

  const caller = await getCaller(req.get('Authorization'));

  const deletingArticle = await Article.findOne({ where: { id: articleId } });
  if (deletingArticle) {
    if (caller) {
      if (caller.id !== deletingArticle.creatorId) {
        res.status(400);
        res.send('작성자 본인이 아닙니다.');
        return;
      }
    }

    deletingArticle
      .destroy()
      .then((result) => {
        console.log('deleted');
        res.status(200);
        res.send(result);
      })
      .catch((e) => {
        res.status(500);
        res.send(e);
      });
  }
});

export default ArticleRouter;
