import express from 'express';
import { isUndefined } from 'lodash';
import sequelize from '../models';
import { user } from '../models/user';

const UserRouter = express.Router();
const User = sequelize.user;

/**
 * @getUser
 */
UserRouter.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  if (!isUndefined(userId)) {
    await User.findOne({ where: { id: userId } }).then((result) => {
      if (result !== null) {
        res.status(200);
        res.send(result);
      } else {
        res.send('USER_NOT_FOUND');
      }
    }).catch((e) => {
      console.log(e);
      res.send('SERVER_ERROR');
    });
  } else {
    res.status(400);
    res.send('BAD_REQUEST');
  }
});

/**
 * @getUsers
 */
UserRouter.get('/users', async (req, res) => {
  await User.findAll().then((result) => {
    if (result !== null) {
      res.send(result);
    } else {
      res.send('USERS_NOT_FOUND');
    }
  }).catch((e) => {
    console.log(e);
    res.send('SERVER_ERROR');
  });
});

/**
 * @createUser
 */
UserRouter.post('/user', (req, res) => {
  const creatingUser = req.body as user;
  console.log('creating', creatingUser);
  User.create(creatingUser).then((result) => {
    console.log('success');
    res.send(result);
  }).catch((e) => {
    console.log(e);
    console.log('failed');
    res.send(null);
  });
});

/**
 * @updateUser
 */
UserRouter.put('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const updatingUser = req.body as user;
  if (Number(userId) !== updatingUser.id) {
    console.log('id doesn\'t match');
    res.send('failed');
    return;
  }
  console.log('updating', updatingUser);
  User.update(updatingUser, { where: { id: userId } }).then((result) => {
    console.log('success');
    res.send(result);
  }).catch((e) => {
    console.log(e);
    console.log('failed');
    res.send(null);
  });
});

/**
 * @deleteUser
 */
UserRouter.delete('/user/:userId', (req, res) => {
  const { userId } = req.params;
  console.log('deleting', userId);
  User.destroy({ where: { id: userId } }).then((result) => {
    console.log(result);
    res.status(200);
    res.send('done');
  }).catch((e) => {
    res.status(500);
    res.send(e);
  });
});

export default UserRouter;
