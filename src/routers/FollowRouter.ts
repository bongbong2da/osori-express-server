import express from 'express';
import jwt from 'jsonwebtoken';
import { trimNull } from '../utils/objectUtil';
import sequelize from '../models';

const FollowRouter = express.Router();
const Follow = sequelize.follow;
const User = sequelize.user;

FollowRouter.post('/follow/:userId', async (req, res) => {
  try {
    // @ts-ignore
    const follower = jwt.decode((req.header('Authorization') as string).split(' ')[1]).user as user;
    const followeeId = Number(req.params.userId);

    const exists = await Follow.findOne({ where: { follower: follower.id, followee: followeeId } });
    if (exists) {
      throw { code: 409, message: '이미 팔로우한 유저입니다' };
    } else {
      Follow.create({ follower: follower.id, followee: followeeId })
        .then((result) => {
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

FollowRouter.delete('/follow/:userId', (req, res) => {
  try {
    // @ts-ignore
    const follower = jwt.decode((req.header('Authorization') as string).split(' ')[1]).user as user;
    const followeeId = Number(req.params.userId);

    Follow.destroy({ where: { follower: follower.id, followee: followeeId } }).then((result) => {
      res.send('UNFOLLOWED');
    });
  } catch (e: any) {
    console.log(e);
    res.status(e.code || 500);
    res.send(e.message || e);
  }
});

FollowRouter.get('/follow/follower/:userId', async (req, res) => {
  try {
    const targetUserId = Number(req.params.userId);

    const targetUser = await User.findOne({ where: { id: targetUserId } });
    if (!targetUser) {
      res.status(400);
      res.send('사용자가 조회되지 않습니다');
    } else {
      const follows = await targetUser.getFolloweeFollows().then((res) => res);
      const followers = await Promise.all(
        follows.map(async (follow) => {
          const user = await follow.getFollowerUser();
          return trimNull(user.get());
        }),
      );
      res.send(followers);
    }
  } catch (e) {
    console.log('err');
    res.status(500);
    res.send(e);
  }
});

FollowRouter.get('/follow/following/:userId', async (req, res) => {
  try {
    const targetUserId = Number(req.params.userId);

    const targetUser = await User.findOne({ where: { id: targetUserId } });
    if (!targetUser) {
      res.status(400);
      res.send('사용자가 조회되지 않습니다');
    } else {
      const follows = await targetUser.getFolloweeFollows().then((res) => res);
      const followers = await Promise.all(
        follows.map(async (follow) => {
          const user = await follow.getFolloweeUser();
          return trimNull(user.get());
        }),
      );
      res.send(followers);
    }
  } catch (e) {
    console.log('err');
    res.status(500);
    res.send(e);
  }
});

export default FollowRouter;
