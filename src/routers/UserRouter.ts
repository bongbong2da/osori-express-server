import express from 'express';
import jwt from 'jsonwebtoken';
import { isUndefined } from 'lodash';
import { Op } from 'sequelize';
import sequelize from '../models';
import { user } from '../models/user';
import { makeFilter, makePagination, trimNull } from '../utils/objectUtil';

const UserRouter = express.Router();
const User = sequelize.user;
const Token = sequelize.token;

/**
 * @getUser
 */
UserRouter.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const parameters = req.query;

  if (parameters.loginType) {
    if (!isUndefined(userId)) {
      await User.findOne({ where: { externalId: userId as string, loginType: parameters.loginType as string } }).then((result) => {
        if (result !== null) {
          res.status(200);
          res.send(trimNull(result.get()));
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
  } else if (!isUndefined(userId)) {
    await User.findOne({ where: { id: userId } }).then((result) => {
      if (result !== null) {
        res.status(200);
        res.send(trimNull(result.get()));
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
  const { filter, offset } = makeFilter(req.query);
  await User.findAndCountAll({
    offset,
    limit: filter.size,
    where: {
      nickname: { [Op.substring]: filter.searchKeyword },
    },
    order: [['id', 'DESC']],
  }).then((result) => {
    const { rows, count } = result;
    if (result.rows !== null) {
      const payload = rows.map((user) => trimNull(user.get()));
      const pagination = makePagination(filter, rows.length, count);
      res.setHeader('X-Pagination', pagination);
      res.send(payload);
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
    res.send(trimNull(result.get()));
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

UserRouter.post('/user/login', async (req, res) => {
  const creatingUser = req.body as user;
  creatingUser.loginDate = new Date().toString();
  const { loginType } = creatingUser;

  console.log('loginType', loginType);
  const findOptions = loginType !== 'NONE' ? { where: { externalId: creatingUser.externalId } } : { where: { id: creatingUser.id } };
  console.log('option', findOptions);

  const user = await User.findOne(findOptions).then(async (result) => {
    if (!result) {
      await User.create(creatingUser).then(async (newUser) => {
        const accessToken = jwt.sign({ user: newUser.get() }, process.env.JWT_SECRET_KEY!, { algorithm: 'HS256', expiresIn: '7d' });
        const refreshToken = jwt.sign({ accessToken }, process.env.JWT_SECRET_KEY!, { algorithm: 'HS256', expiresIn: '30d' });

        await Token.create({ userId: newUser.id, accessToken, refreshToken }).then((result) => {
          if (result !== null) {
            res.send({ accessToken, refreshToken });
          } else {
            res.status(500);
            res.send('FAILED_TO_SAVE_TOKENS');
          }
        });
      }).catch((e) => {
        console.log(e);
        res.status(500);
        res.send('FAILED_TO_CREATE_USER');
      });
    }
    return result;
  });

  if (user) {
    await Token.findOne({ where: { userId: user.id } }).then(async (token) => {
      const accessToken = jwt.sign({ user: user.get() }, process.env.JWT_SECRET_KEY!, { algorithm: 'HS256', expiresIn: '7d' });
      const refreshToken = jwt.sign({ accessToken }, process.env.JWT_SECRET_KEY!, { algorithm: 'HS256', expiresIn: '30d' });

      if (token === null) {
        await Token.create({ userId: user.id, accessToken, refreshToken }).then((result) => {
          if (result !== null) {
            res.send({ accessToken, refreshToken });
          } else {
            res.status(500);
            res.send('FAILED_TO_SAVE_TOKENS');
          }
        });
      } else {
        await Token.update({ accessToken, refreshToken }, { where: { userId: user.id }, returning: true }).then((result) => {
          console.log(result);
          if (result !== null) {
            res.send({ accessToken, refreshToken });
          }
        });
      }
    });
  } else {
    res.status(400);
    res.send('FAILED_TO_LOGIN');
  }
});

export default UserRouter;
