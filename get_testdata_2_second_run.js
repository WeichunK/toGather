const axios = require('axios')
const mysql = require('mysql2/promise');
const multipleStatements = true;
// const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_DATABASE_TEST } = process.env;
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

require('dotenv').config();
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;

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

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const pool = mysql.createPool(mysqlConfig, { multipleStatements });

// 美食 電影 運動戶外 讀書會 桌遊 其他


var tempDict = {}

const test = async function () {


    const conn = await pool.getConnection();

    let gatheringList = await conn.query('select *from participant_temp_2;');
    console.log('gatheringList[0', gatheringList[0])


    for (let i in gatheringList[0]) {
        // console.log('gatheringList[0].id', gatheringList[0].id)
        console.log('gatheringList[0][i].id,gatheringList[0][i].id')
        tempDict[gatheringList[0][i].id] = gatheringList[0][i].participant_id
    }

    // console.log('gatheringList', gatheringList)
    // console.log('tempDict', tempDict)

}

test()

axios.get(`https://api.eatgether.io/v4.0/meetup/list/TW?cities=[%22NWT%22,%22TPE%22]`)
    .then(async (response) => {
        console.log('num of meetups: ', response.data.meetups.length)
        console.log(response.data.meetups[0])
        console.log('getConnection')



        return response
    })

    .then(async (response) => {
        // console.log('userList 2', response.data.userList)
        // console.log('num of meetups: 2', response.data.meetups.length)

        let result
        let userId
        const conn = await pool.getConnection();
        for (let i in response.data.meetups) {


            if (!tempDict[response.data.meetups[i].ID]) {






                console.log('i: ', i)
                timeout(300)

                let binding = {
                    id: response.data.meetups[i].ID,
                    cover: response.data.meetups[i].cover,
                    host_id: response.data.meetups[i].host.ID,
                }

                result = await conn.query('INSERT INTO gathering_temp_2 set ?', binding);

                try {




                    await axios.get(`https://api.eatgether.io/v4.0/meetup/applicants/${response.data.meetups[i].ID}`)
                        .then(async (participant) => {


                            for (let j in participant.data.applicants) {
                                let binding2 = {
                                    id: response.data.meetups[i].ID,
                                    participant_id: participant.data.applicants[j].ID,
                                }

                                await conn.query('INSERT INTO participant_temp_2 set ?', binding2);



                            }



                        })
                } catch {
                    console.log('no participant')
                }



            }

            await conn.release();
            console.log('finished inserting data')

        }

    })





    .catch((error) => {
        if (error.response) {
            // When response status code is out of 2xx range 
            // console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
        } else if (error.request) {
            // When no response was recieved after request was made
            console.log(error.request)
        } else {
            // Error
            console.log(error.message)
        }
    })