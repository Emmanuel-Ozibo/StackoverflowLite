import {Pool, Client} from "pg";
import config from "config"

const pool = new Pool({
    user: `${config.get('db_USER')}`, 
    host: `${config.get('db_HOST')}`,
    database: `${config.get('db_NAME')}`, 
    password: `${config.get('db_PASSWORD')}`, 
    port: config.get('db_PORT')
})
console.log(`${config.get('db_USER')}`)
module.exports = pool