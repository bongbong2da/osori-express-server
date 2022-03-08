import express from 'express';
import { isUndefined } from 'lodash';
import sequelize from '../models';
import { user } from '../models/user';
import { article } from '../models/article';

const ArticleRouter = express.Router();
const Article = sequelize.article;

/**
 * @getArticle
 */
ArticleRouter.get('/article/:articleId', (req, res) => {
  console.log('get article');
  const { articleId } = req.params;
  if (!isUndefined(articleId)) {
    Article.findOne({ where: { id: articleId } }).then((result) => {
      if (result !== null) {
        res.send(result);
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
 * @getArticles
 */
ArticleRouter.get('/articles', (req, res) => {
  let filter = {};
  const { creatorId } = req.query;
  if (typeof creatorId !== 'undefined') {
    filter = { where: { creatorId } };
  }

  Article.findAll(filter).then((result) => {
    if (result !== null) {
      res.send(result);
    } else {
      res.send('ARTICLE_NOT_FOUND');
    }
  }).catch((e) => {
    console.log(e);
    res.send('SERVER_ERROR');
  });
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
