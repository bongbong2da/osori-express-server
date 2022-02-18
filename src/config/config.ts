import dotenv from 'dotenv';

dotenv.config();

const config = {
    development :
        {
            "username": "ln_admin",
            "password": "nerdynerdy",
            "database": "osori",
            "host": "52.78.191.78",
            "dialect": "mariadb"
        }
};

export default config;