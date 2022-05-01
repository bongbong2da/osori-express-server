import express from 'express';
import { messaging } from 'firebase-admin';
import { CommentDto } from '../payloads/payloads';
import { getCaller, makeFilter, makePagination, trimNull } from '../utils/objectUtil';
import { commentAttributes } from '../models/comment';
import FirebaseApp from '../firebase/FirebaseApp';
import sequelize from '../models';

const CommentRouter = express.Router();
const Comment = sequelize.comment;
const Article = sequelize.article;
const User = sequelize.user;

FirebaseApp();

const msg = messaging();

CommentRouter.post('/comments/:articleId', async (req, res) => {
  const caller = await getCaller(req.header('Authorization'));
  const { articleId } = req.params;
  const comment = req.body as commentAttributes;
  comment.articleId = Number(articleId);
  comment.creatorId = caller?.id!;

  await Comment.create(comment).then(async (result) => {
    if (result) {
      const targetArticle = await Article.findOne({ where: { id: articleId } });
      if (targetArticle) {
        const creator = await targetArticle.getCreator().then((result) => result);
        if (creator) {
          if (creator?.pushToken) {
            msg.send({
              token: creator.pushToken,
              notification: {
                title: `${caller?.nickname}님이 댓글을 작성하셨습니다`,
              },
            });
          }
        }
      }
      res.send(result);
    } else {
      res.status(400);
      res.send('err');
    }
  });
});

CommentRouter.get('/comments/:articleId', async (req, res) => {
  try {
    const caller = await getCaller(req.header('Authorization'));
    const targetArticleId = req.params.articleId;
    const { filter, offset } = makeFilter(req.query);

    await Comment.findAndCountAll({
      offset,
      limit: filter.size,
      where: { articleId: targetArticleId },
      order: [['id', 'DESC']],
    }).then(async (result) => {
      const { count, rows } = result;
      const pagination = makePagination(filter, rows.length, count);
      if (rows) {
        const payloads = await Promise.all(
          rows.map(async (comment) => {
            const commentor = await User.findOne({ where: { id: comment.creatorId } });
            if (commentor) {
              const payload: CommentDto = {
                ...trimNull(comment.get()),
                creator: trimNull(commentor.get()),
              };
              return payload;
            }
          }),
        );
        res.setHeader('x-pagination', pagination);
        res.send(payloads);
      }
    });
  } catch (e) {
    res.status(500);
    res.send('SERVER_ERR');
  }
});

CommentRouter.get('/comments/mine', async (req, res) => {
  try {
    const caller = await getCaller(req.header('Authorization'));
    const { filter, offset } = makeFilter(req.query);

    await Comment.findAndCountAll({
      offset,
      limit: filter.size,
      where: { creatorId: caller?.id },
      order: [['id', 'DESC']],
    }).then((result) => {
      const { count, rows } = result;
      const pagination = makePagination(filter, rows.length, count);
      const payloads = rows.map((comment) => ({
        ...trimNull(comment.get()),
        creator: trimNull(caller?.get()),
      }));

      res.setHeader('x-pagination', pagination);
      res.send(payloads);
    });
  } catch (e) {
    res.status(500);
    res.send('SERVER_ERR');
  }
});

CommentRouter.put('/comments/:commentId', async (req, res) => {
  try {
    const caller = await getCaller(req.header('Authorization'));
    const { commentId } = req.params;
    const comment = req.body as commentAttributes;
    console.log('comment', comment);

    if (comment.creatorId === caller?.id) {
      await Comment.update(comment, { where: { id: commentId } }).then((result) => {
        console.log('update', result);
        if (result) {
          res.send(result);
        } else {
          res.status(400);
          res.send('SERVER_ERR');
        }
      });
    } else {
      res.status(409);
      res.send('작성자 본인이 아닙니다.');
    }
  } catch (e) {
    console.log(e);
    res.status(500);
    res.send('SERVER_ERR');
  }
});

CommentRouter.delete('/comments/:commentId', async (req, res) => {
  try {
    const caller = await getCaller(req.get('Authorization'));
    const commentId = Number(req.params.commentId);

    const targetComment = await Comment.findOne({ where: { id: commentId } });
    if (targetComment) {
      if (caller?.id === targetComment.creatorId) {
        Comment.destroy({ where: { id: targetComment?.id } }).then((result) => {
          if (result > 0) {
            res.send('해당 댓글을 삭제하였습니다');
          } else {
            res.status(400);
            res.send('삭제에 실패했습니다');
          }
        });
      } else {
        res.status(409);
        res.send('작성자 본인이 아닙니다');
      }
    } else {
      res.status(400);
      res.send('해당 댓글을 찾을 수 없습니다');
    }
  } catch (e) {
    res.status(500);
    res.send('SERVER_ERR');
  }
});

export default CommentRouter;
