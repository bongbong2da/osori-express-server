import express from "express";
import sequelize from "../models";
import _, {isUndefined} from "lodash";
import {user} from "../models/user";
import {article} from "../models/article";

const ArticleRouter = express.Router();
const Article = sequelize.article;

/**
 * @getArticle
 */
ArticleRouter.get('/:articleId', (req, res) => {
    const articleId = req.params.articleId;
    if (!isUndefined(articleId)) {
        Article.findOne({where : {id : articleId}}).then((result) => {
            if (result !== null) {
                res.send(result)
            } else {
                res.send('ARTICLE_NOT_FOUND')
            }
        }).catch((e) => {
            res.send('SERVER_ERROR')
        })
    }
})

/**
 * @getArticles
 */
ArticleRouter.get('/', (req, res) => {
        Article.findAll().then((result) => {
            if (result !== null) {
                res.send(result)
            } else {
                res.send('ARTICLE_NOT_FOUND')
            }
        }).catch((e) => {
            res.send('SERVER_ERROR')
        })
})

/**
 * @createArticle
 */
ArticleRouter.post('/', async (req, res) => {
    const creatingArticle = req.body as article;

    const creator = user.findOne({where :{id : creatingArticle.creator_id}});
    if (creator === null) {
        res.send('user not found')
        return;
    }

    console.log('creating', creatingArticle);
    Article.create(creatingArticle).then(result => {
        console.log('success');
        res.send(null)
    }).catch((e) => {
        console.log(e)
        console.log('failed')
        res.send(null)
    })
})

/**
 * @updateArticle
 */
ArticleRouter.put('/:articleId', (req, res) => {
    const articleId = req.params.articleId;
    const updatingArticle = req.body as user;
    if (Number(articleId) !== updatingArticle.id) {
        console.log(`id doesn't match`);
        res.send('failed')
        return;
    }
    console.log('updating', updatingArticle);
    Article.update(updatingArticle, {where : {id : articleId}}).then(result => {
        console.log('success');
        res.send(null)
    }).catch((e) => {
        console.log(e)
        console.log('failed')
        res.send(null)
    })
})

/**
 * @deleteArticle
 */
ArticleRouter.delete('/:articleId', (req, res) => {
    const articleId = req.params.articleId;
    console.log('deleting', articleId);
    Article.destroy({where : {id : articleId}}).then((result) => {
        console.log('deleted')
        res.status(200);
        res.send('done')
    }).catch((e) => {
        res.status(500)
        res.send(e);
    })
})

export default ArticleRouter;