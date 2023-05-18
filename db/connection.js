import dotenv from 'dotenv'
dotenv.config()
import mySQL from 'mysql2'
const con = mySQL.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
})

export default con