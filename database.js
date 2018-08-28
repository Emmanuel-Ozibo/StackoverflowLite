const{Pool, Client} = require('pg')
const pool = new Pool({
    user: 'postgres', 
    database: 'sofDb', 
    password: `${process.env.PASSWORD}`, 
    port: 5432
})
module.exports = pool