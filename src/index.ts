import express from 'express';
import swaggerJSDoc, { SwaggerDefinition } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import ArticleRouter from './routers/ArticleRouter';
import UserRouter from './routers/UserRouter';

const app = express();
let port = 3000;

// Run with ts-node line port={port} parameter
process.argv.forEach((arg) => {
  if (arg.startsWith('port')) {
    const arr = arg.split('port=');
    port = Number(arr[1]);
  }
});

app.use(cors());

app.use(express.json());

/**
 * @Swagger
 */

const swaggerDefinitions : SwaggerDefinition = {
  swagger: '2.0',
  host: 'osori.team-penthouse.com',
  schemes: ['https'],
  info: {
    title: 'Osori Server',
    version: '1.0.0',
    description: '오소리 서버 Swagger OpenAPI 3.0',
  },
};

const swagger = swaggerJSDoc({
  swaggerDefinition: swaggerDefinitions,
  apis: ['build/swagger.yaml'],
});

const jsonSchema = require('../build/swagger.json');

app.get('/api-docs/swagger.json', (req, res) => res.json(jsonSchema));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger, { swaggerUrl: '/api-docs/swagger.json' }));

app.get('/', (req, res) => {
  res.send('OSORI_SERVER');
});

app.use(UserRouter);
app.use(ArticleRouter);

app.post('/clova/callback', (req, res) => {
  if (req.statusCode === 200) {
    res.send(req.body);
  }
});

app.listen(port, async () => {
  console.log('SERVER_STARTED', port);
});
