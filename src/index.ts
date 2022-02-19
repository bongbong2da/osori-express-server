import express from 'express';
import UserRouter from "./routers/UserRouter";
import ArticleRouter from "./routers/ArticleRouter";
import swaggerJSDoc, {SwaggerDefinition} from "swagger-jsdoc";
import {SwaggerOptions} from "swagger-ui-express";
import swaggerUi from 'swagger-ui-express'

const app = express();

app.use(express.json());

/**
 * @Swagger
 */

const swaggerDefinitions : SwaggerDefinition = {
    swagger : '2.0',
    info : {
        title : 'Osori Server',
        version : '1.0.0',
        description : 'Osori Server Swagger OpenAPI 3.0',
    },
}

const swagger = swaggerJSDoc({
    swaggerDefinition : swaggerDefinitions,
    apis:["build/swagger.yaml"]
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swagger,{explorer:true}))


app.get('/', (req, res, next) => {
    res.send('OSORI_SERVER')
});

app.use('/user', UserRouter);
app.use('/article', ArticleRouter);

app.listen(3000, async () => {
    console.log('server started')
})