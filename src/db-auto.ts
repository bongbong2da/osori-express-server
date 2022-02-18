import {SequelizeAuto} from "sequelize-auto";
import config from "./config/config";

const auto = new SequelizeAuto(
    config.development.database,
    config.development.username,
    config.development.password,
    {
        directory: "src/models", singularize: true, useDefine: false,
        host : config.development.host,
        port : 3306,
        dialect : 'mariadb',
        caseModel : 'c',
        caseFile : 'c',
        additional : {
            timestamps : false,
        },
        lang : 'ts'
    }
)

auto.run().then(() => {
    console.log('done')
})