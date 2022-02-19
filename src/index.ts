import express from 'express';
import UserRouter from "./routers/UserRouter";
import ArticleRouter from "./routers/ArticleRouter";
import swaggerJSDoc, {SwaggerDefinition} from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express'

const app = express();
let port = 3000;

//Run with ts-node line port={port} parameter
process.argv.forEach((arg) => {
    if (arg.startsWith('port')) {
        const arr = arg.split('port=');
        port = Number(arr[1]);
    }
})

app.use(express.json());

/**
 * @Swagger
 */

const swaggerDefinitions : SwaggerDefinition = {
    swagger : '2.0',
    host : "52.78.191.78:3000",
    schemes : ["https"],
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

app.listen(port, async () => {
    console.log('SERVER_STARTED',port)
})