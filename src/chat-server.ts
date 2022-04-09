import express from 'express';
import * as http from 'http';
import * as io from 'socket.io';
import cors from 'cors';
import ChatRouter from './chat/ChatRouter';

const chatServer = express();
chatServer.use(express.json());
chatServer.use(cors());

chatServer.use(ChatRouter);

const server = http.createServer(chatServer);
const socketIO = new io.Server(server);

chatServer.get('/chat', (req, res) => {
  res.sendFile(`${__dirname}/test/chat.html`);
});

socketIO.on('connect', (socket) => {
  console.log('connected');

  socket.on('chat message', (msg) => {
    console.log(msg);
  });
});

server.listen(4885, () => {
  console.log('CHAT_SERVER_STARTED_4885');
});
