import { randomUUID } from 'crypto';
import express from 'express';

const FileRouter = express.Router();

FileRouter.post('/upload', (req, res) => {
  if (!req.header('Content-Type')?.startsWith('multipart/form-data')) {
    res.status(400);
    res.send('잘못된 형식의 파일입니다.');
    return;
  }

  res.send(req.body);
});

FileRouter.get('/file/:fileId', (req, res) => {});

export default FileRouter;
