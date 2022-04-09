import express from 'express';
import { getCaller, trimNull } from '../utils/objectUtil';
import sequelize from '../models';

const ChatRouter = express.Router();
const User = sequelize.user;
const ChatRoom = sequelize.chatRoom;
const ChatMessage = sequelize.chatMessage;

ChatRouter.post('/chat/join', async (req, res) => {
  const caller = await getCaller(req.header('Authorization'));
  if (caller) {
    console.log(req.body);

    if (!req.body?.partnerId) {
      res.status(400);
      res.send('대화 상대가 특정되지 않았습니다.');
      return;
    }
    const { partnerId } = req.body;
    if (partnerId) {
      // 상대방이 유효한 사용자인지
      const partner = await User.findOne({ where: { id: partnerId } });
      if (!partner) {
        res.status(400);
        res.send('사용자를 찾지 못하였습니다.');
      }

      ChatRoom.findOne({ where: { maker: caller.id, partner: partnerId } }).then(async (room) => {
        // 기존 진행중인 채팅방이 있을 경우
        if (room) {
          const existRoom: any = { ...trimNull(room.get()) };
          const totalCount = await room.countChatMessages();
          existRoom.totalMessageCount = totalCount;
          res.send(existRoom);
        } else {
          // 진행중인 대화방이 없을 때
          ChatRoom.create({ maker: caller.id, partner: partnerId }).then((room) => {
            const createdRoom: any = { ...room.get() };
            createdRoom.totalMessageCount = 0;
            res.send(room);
          });
        }
      });
    }
  } else {
    res.status(401);
    res.send('인증되지 않은 사용자입니다.');
  }
});

export default ChatRouter;
