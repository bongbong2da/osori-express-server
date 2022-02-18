import {Sequelize} from "sequelize";
import config from '../config/config';
import {initModels} from "./init-models";

const server = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password,
    {
        host : config.development.host,
        dialect : 'mariadb',
        timezone : '+09:00'
    }
)

const sequelize = initModels(server);

export default sequelize;