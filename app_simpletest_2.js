const express = require('express');

const app = express();
const cors = require('cors');


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();

const port = 3000
app.use(cors());

const axios = require('axios')

const mysql = require('mysql2/promise');
const multipleStatements = true;
// const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_DATABASE_TEST } = process.env;
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt');
const salt = parseInt(process.env.BCRYPT_SALT);

require('dotenv').config();
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, TEST_USER_PWD } = process.env;

const mysqlConfig = { // for EC2 machine
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    port: "3306",
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
    database: DB_DATABASE,
}

// // API routes
// app.use('/api/' + API_VERSION,
//     // rateLimiterRoute,
//     [
//         require('./server/routes/gathering_route'),
//         // require('./server/routes/admin_route'),
//         // require('./server/routes/product_route'),
//         // require('./server/routes/marketing_route'),
//         require('./server/routes/user_route'),
//         require('./server/routes/tracking_route'),
//     ]
// );

const pool = mysql.createPool(mysqlConfig, { multipleStatements });


app.get('/', (req, res) => {


    res.send('Hello World')
})




app.use(async () => {
    // const headers = {
    //     'Content-Type': 'application/json',
    //     'x-api-key': 'partner_PHgswvYEk4QY6oy3n8X3CwiQCVQmv91ZcFoD5VrkGFXo8N7BFiLUxzeG'
    // }
    const conn = await pool.getConnection();


    let result = await conn.query('select g.id, g.temp_id as event_id, host_id, m.id as user_id, cover from gathering_temp_2 g left join member_temp_2 m on g.host_id=m.member_id where g.temp_id >335;');

    console.log('id', result[0][0].id)
    console.log('result[0][0]', result[0][0])


    const headers = { 'authorization': 'BEARER eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhMDk2NTY0ZS00OTBkLTQ5OTEtOTI3Yy0yOGUyOGUyNGIxMWEiLCJleHAiOjE5NTE3MTI3NTUsImlhdCI6MTYzNjM1Mjc1NSwiaXNzIjoiaHR0cHM6Ly9lYXRnZXRoZXIuaW8iLCJuYmYiOjE2MzYzNTI3NTUsInN1YiI6ImFwLXNvdXRoZWFzdC0xOmY0YWY4N2Y4LWIyYmItNDIwYy1hYWUzLTEwMjc2MzJlMTNhNCJ9.hVHnlcJG0XXVHwVLIsKNM16i-tScvjZqlDxQ4bC0O-_9WHg2-c9guDfox2jO8ncHshmzfmRdnlk6d-3ncCwBeA' }



    let binding;

    const user_password = TEST_USER_PWD

    let encryptedPWD = bcrypt.hashSync(user_password, salt)

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    for (let j = 0; j < 1; j++) {
        console.log('j', j)
        await timeout(500);

        try {

            console.log('result[0][j].member_id', result[0][j].member_id)
            let response = await axios.get(`https://api.eatgether.io/v4.0/member/profile/${result[0][j].member_id}`, { headers: headers })

            //console.log("response.data", response.data);
            // console.log("response.email", response.data.email);
            //console.log("response fron FB", response);
            //'id,name,email,picture'
            console.log('response', response.data)


        } catch (err) {
            console.log('err', err.message)
        }


    }


})














app.listen(port, () => { console.log(`Listening on port: ${port}`); });


// app.io = io;

module.exports = { app };
// module.exports = { app, server, io };