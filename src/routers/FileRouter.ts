import { S3 } from 'aws-sdk';
import express from 'express';
// @ts-ignore

const awsConfig = require('../config/awsconfig.json');

const FileRouter = express.Router();
const s3 = new S3({
  credentials: awsConfig,
});
const BUCKET_NAME = 'osori-bucket';

FileRouter.get('/upload/test', (req, res) => {
  res.send('done');
});

FileRouter.post('/upload', (req, res) => {
  console.log(req.files?.file);
  const params = {
    Bucket: BUCKET_NAME,
    // @ts-ignore
    Key: req.files?.file?.name,
    // @ts-ignore
    Body: req.files?.file?.data,
  };

  s3.upload(params, (err: any, data: any) => {
    if (err) {
      console.log('FAILED_TO_SEND', err);
      res.status(500).send(err);
    } else {
      console.log('SEND_SUCCESS');
      // @ts-ignore
      res.status(200).send(data.Location);
    }
  });
});

export default FileRouter;
