import express from "express";
import sequelize from "../models";
import _, {isUndefined} from "lodash";
import {user} from "../models/user";

const UserRouter = express.Router();
const User = sequelize.user;

/**
 * @getUser
 */
UserRouter.get('/:userId', (req, res) => {
    const userId = req.params.userId;
    if (!isUndefined(userId)) {
        User.findOne({where : {id : userId}}).then((result) => {
            if (result !== null) {
                res.send(result)
            } else {
                res.send('USER_NOT_FOUND')
            }
        }).catch((e) => {
            res.send('SERVER_ERROR')
        })
    }
})

/**
 * @getUser
 */
UserRouter.get('/', async (req, res) => {
    await User.findAll().then((result) => {
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
 * @createUser
 */
UserRouter.post('/', (req, res) => {
    const creatingUser = req.body as user;
    console.log('creating', creatingUser);
    User.create(creatingUser).then(result => {
        console.log('success');
        res.send(null)
    }).catch((e) => {
        console.log(e)
        console.log('failed')
        res.send(null)
    })
})

/**
 * @updateUser
 */
UserRouter.put('/:userId', (req, res) => {
    const userId = req.params.userId;
    const updatingUser = req.body as user;
    if (Number(userId) !== updatingUser.id) {
        console.log(`id doesn't match`);
        res.send('failed')
        return;
    }
    console.log('updating', updatingUser);
    User.update(updatingUser, {where : {id : userId}}).then(result => {
        console.log('success');
        res.send(null)
    }).catch((e) => {
        console.log(e)
        console.log('failed')
        res.send(null)
    })
})

/**
 * @deleteUser
 */
UserRouter.delete('/:userId', (req, res) => {
    const userId = req.params.userId;
    console.log('deleting', userId);
    User.destroy({where : {id : userId}}).then((result) => {
        console.log('deleted')
        res.status(200);
        res.send('done')
    }).catch((e) => {
        res.status(500)
        res.send(e);
    })
})

export default UserRouter;