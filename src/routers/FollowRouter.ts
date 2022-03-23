import express from 'express';
import jwt from 'jsonwebtoken';
import { user } from '../models/user';
import sequelize from '../models';

const FollowRouter = express.Router();
const Follow = sequelize.follow;

FollowRouter.post('/follow/:userId', async (req, res) => {
  try {
    // @ts-ignore
    const follower = jwt.decode((req.header('Authorization') as string).split(' ')[1]).user as user;
    const followeeId = Number(req.params.userId);

    const exists = await Follow.findOne({ where: { follower: follower.id, followee: followeeId } });
    if (exists) {
      throw { code: 409, message: '이미 팔로우한 유저입니다' };
    } else {
      Follow.create({ follower: follower.id, followee: followeeId }).then((result) => {
        res.send(result.get());
      }).catch(() => {
        throw { code: 500, message: 'server error' };
      });
    }
  } catch (e : any) {
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
  } catch (e : any) {
    console.log(e);
    res.status(e.code || 500);
    res.send(e.message || e);
  }
});

export default FollowRouter;
