import FileRouter from './routers/FileRouter';
import CommentRouter from './routers/CommentRouter';
import dotenv from 'dotenv';
import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import swaggerJSDoc, { SwaggerDefinition } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import FeedRouter from './routers/FeedRouter';
import ScrapRouter from './routers/ScrapRouter';
import FollowRouter from './routers/FollowRouter';
import sequelize from './models';
import ArticleRouter from './routers/ArticleRouter';
import UserRouter from './routers/UserRouter';
import fileUpload from 'express-fileupload';

const app = express();
dotenv.config();
console.log(process.env.NODE_ENV);
console.log('starting env', process.env.NODE_ENV);
let port = process.env.NODE_ENV === 'development' ? 3000 : 80;
console.log('starting port', port);

// Run with ts-node line port={port} parameter
process.argv.forEach((arg) => {
  if (arg.startsWith('port')) {
    const arr = arg.split('port=');
    port = Number(arr[1]);
  }
});

app.use(cors());

app.use(express.json());
app.use(fileUpload());

/**
 * @Authorization
 */
const Token = sequelize.token;
app.use((req, res, next) => {
  if (req.path === '/user/login' || req.path.startsWith('/api-docs')) {
    next();
    return;
  }

  if (req.path.startsWith('/upload')) {
    next();
    return;
  }

  const accessToken = req.header('Authorization')?.split('Bearer ')[1];

  // 제공된 토근이 있다면
  if (typeof accessToken !== 'undefined') {
    jwt.verify(accessToken, process.env.JWT_SECRET_KEY!, async (err, decoded) => {
      // 시크릿 키 대조
      if (err) {
        // 올바르지 않은 토큰일 경우 401
        res.status(401);
        res.send('NOT_AUTHORIZED');
      } else if (typeof decoded !== 'undefined') {
        // 올바른 토큰일 시
        const { user } = decoded as JwtPayload;
        await Token.findOne({ where: { userId: user.id } }).then((token) => {
          if (token !== null) {
            const tokenFromDB = jwt.decode(token.accessToken!) as JwtPayload;
            if (tokenFromDB !== null) {
              if (user.exp < tokenFromDB.user.exp) {
                // 토큰이 만료된 경우
                res.status(401);
                res.send('TOKEN_IS_EXPIRED_LOGIN_REQUIRED');
              } else {
                next();
              }
            }
          }
        });
      }
    });
  } else {
    res.status(401);
    res.send('TOKEN_IS_REQUIRED');
  }
});

/**
 * @Swagger
 */

const swaggerDefinitions: SwaggerDefinition = {
  swagger: '2.0',
  host: process.env.NODE_ENV === 'development' ? `localhost:${port}` : 'osori.team-penthouse.com',
  schemes: ['https'],
  info: {
    title: 'Osori Server',
    version: '1.0.0',
    description: '오소리 서버 Swagger OpenAPI 3.0',
  },
};

const swagger = swaggerJSDoc({
  swaggerDefinition: swaggerDefinitions,
  apis: ['swagger/swagger.yaml'],
});

const jsonSchema = require('../swagger/swagger.json');

app.get('/api-docs/swagger.json', (req, res) => res.json(jsonSchema));
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swagger, { swaggerUrl: '/api-docs/swagger.json' }),
);

app.get('/', (req, res) => {
  res.send('OSORI_SERVER');
});

app.set('etag', false);

app.use(UserRouter);
app.use(ArticleRouter);
app.use(FollowRouter);
app.use(ScrapRouter);
app.use(FeedRouter);
app.use(CommentRouter);
app.use(FileRouter);

app.listen(port, async () => {
  console.log('SERVER_STARTED', port);
});
