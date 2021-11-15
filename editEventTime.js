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



const pool = mysql.createPool(mysqlConfig, { multipleStatements });

// 美食 電影 運動戶外 讀書會 桌遊 其他




function myfunc(Interval) {
    console.log("myfunc ", Interval);
}
var myInterval = setInterval(myfunc, 1000, 'hi');





const get_data = async () => {
    const conn = await pool.getConnection();


    // console.log('result[1][0]', result[1][0])
    // console.log('result[0][1]', result[0][1])
    // console.log('result[1][1]', result[1][1])

    // conn.release()

    let binding;

    const user_password = TEST_USER_PWD

    let encryptedPWD = bcrypt.hashSync(user_password, salt)

    // function timeout(ms) {
    //     return new Promise(resolve => setTimeout(resolve, ms));
    // }


    let resultM = await conn.query('select * from gathering where id = 1;');

    console.log('resultM[0][0]', resultM[0][0].start_at)

    let eventTime = new Date(resultM[0][0].start_at)

    console.log('eventTime', eventTime + 1814400)





    // const config = {
    //     headers: { 'authorization': 'BEARER eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhMDk2NTY0ZS00OTBkLTQ5OTEtOTI3Yy0yOGUyOGUyNGIxMWEiLCJleHAiOjE5NTE3MTI3NTUsImlhdCI6MTYzNjM1Mjc1NSwiaXNzIjoiaHR0cHM6Ly9lYXRnZXRoZXIuaW8iLCJuYmYiOjE2MzYzNTI3NTUsInN1YiI6ImFwLXNvdXRoZWFzdC0xOmY0YWY4N2Y4LWIyYmItNDIwYy1hYWUzLTEwMjc2MzJlMTNhNCJ9.hVHnlcJG0XXVHwVLIsKNM16i-tScvjZqlDxQ4bC0O-_9WHg2-c9guDfox2jO8ncHshmzfmRdnlk6d-3ncCwBeA' }
    // }

    // for (let j = 0; j < resultM[0].length; j++) {
    //     console.log('j', j)
    //     await timeout(600);
    //     try {
    //         let member = await axios.get(`https://api.eatgether.io/v4.0/member/profile/${resultM[0][j].member_id}?language=zh-TW`, config)


    //         let avatar = await axios.get(`https://api.eatgether.io/v4.0/member/avatar/${resultM[0][j].member_id}`, config)



    //         binding = {
    //             id: resultM[0][j].id,
    //             name: member.data.member.profile.nickname,
    //             email: 'test' + resultM[0][j].id + '@test.com',
    //             job: member.data.member.profile.job,
    //             title: member.data.member.profile.jobTitle,
    //             gender: member.data.member.profile.gender,
    //             age: member.data.member.profile.age,
    //             introduction: member.data.member.profile.introduction,
    //             picture: `https://cdn.eatgether.com/member/${resultM[0][j].member_id}/avatar/${avatar.data.avatars[0]}`,
    //             role: 1,
    //             provider: 'native',
    //             popularity: 0,
    //             coin: 0,
    //             password: encryptedPWD,
    //             origin_id: resultM[0][j].member_id,

    //         }


    //         output = await conn.query('INSERT INTO member set ?', binding);

    //     } catch (err) {
    //         console.log('err', err.message)
    //     }



    // }









    // let result = await conn.query('select g.id, g.temp_id as event_id, host_id, m.id as user_id, cover from gathering_temp_2 g left join member_temp_2 m on g.host_id=m.member_id where g.temp_id >335;');

    // console.log('id', result[0][0].id)
    // console.log('result[0][1]', result[0][1])
    // console.log('result[0][1].id', result[0][1].id)
    // console.log('result.length', result.length)
    // console.log('result[0].length', result[0].length)





    // for (let i = 0; i < result[0].length; i++) {
    //     console.log('i', i)
    //     // console.log('result[0][i]', result[0][i])

    //     await timeout(600);

    //     try {
    //         let event = await axios.get(`https://api.eatgether.io/v4.0/meetup/view/${result[0][i].id}?language=zh-TW`)

    //         // console.log('event', event)
    //         binding = {
    //             id: result[0][i].event_id,
    //             title: event.data.meetup.title,
    //             category: event.data.meetup.categoryName,
    //             description: event.data.meetup.content,
    //             picture: `https://cdn.eatgether.com/meetup/${result[0][i].id}/cover/${result[0][i].cover}`,
    //             host_id: result[0][i].user_id,
    //             start_at: new Date(+new Date(event.data.meetup.startOn) + 8 * 3600 * 1000).toLocaleDateString('zh-TW').slice(0, 19).replace('T', ' '),

    //             created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    //             max_participant: event.data.meetup.numberOfPeople,
    //             min_participant: 2,
    //             place: event.data.meetup.place.address,
    //             lng: 0,
    //             lat: 0,
    //             status: 1,
    //         }
    //         let output = await conn.query('INSERT INTO gathering set ?', binding);

    //     } catch (err) {
    //         console.log('err', err.message)
    //     }




    // }


    // conn = await pool.getConnection();

    // result = await conn.query('select id, member_id from member_temp_2 where id > 628;');

    // console.log('id', result[0][0].id)

    // // conn.release()




    // console.log('write finish')

}

get_data()





// axios.get(`https://api.eatgether.io/v4.0/meetup/view/${response.data.meetups[i].ID}?language=zh-TW`)
//     .then(async (event) => { })




// binding = {
//     title: event.data.meetup.title,
//     category: event.data.meetup.categoryName,
//     description: event.data.meetup.content,
//     picture: `https://cdn.eatgether.com/meetup/${response.data.meetups[i].ID}/cover/${response.data.meetups[i].cover}`,
//     host_id: userId,
//     start_on: new Date(+new Date(event.data.meetup.startOn) + 8 * 3600 * 1000).toLocaleDateString('zh-TW').slice(0, 19).replace('T', ' '),


//     created_on: new Date().toISOString().slice(0, 19).replace('T', ' '),
//     max_participant: event.data.meetup.numberOfPeople,
//     min_participant: 2,
//     place: event.data.meetup.place.address,
//     lng: 0,
//     lat: 0,
//     status: 1,
// }







// axios.get(`https://api.eatgether.io/v4.0/member/profile/${participant.data.applicants[j].ID}?language=zh-TW`, config)
//     .then(async (member) => { })



// let binding = {
//     username: member.data.member.profile.nickname,
//     email: 'test' + (userList.length + 1) + '@test.com',
//     job: member.data.member.profile.job,
//     title: member.data.member.profile.jobTitle,
//     gender: member.data.member.profile.gender,
//     age: member.data.member.profile.age,
//     introduction: member.data.member.profile.introduction,
//     picture: `https://cdn.eatgether.com/member/${member.data.member.ID}/avatar/${avatar.data.avatars[0]}`,
//     role: 1,
//     provider: 'native',
//     password: encryptedPWD,

// }





// axios.get(`https://api.eatgether.io/v4.0/member/avatar/${participant.data.applicants[j].ID}`, config)
//     .then(async (avatar) => { })




// picture: `https://cdn.eatgether.com/meetup/${response.data.meetups[i].ID}/cover/${response.data.meetups[i].cover}`,


//     picture: `https://cdn.eatgether.com/member/${member.data.member.ID}/avatar/${avatar.data.avatars[0]}`,



//         axios.get(`https://api.eatgether.io/v4.0/meetup/list/TW?cities=[%22NWT%22,%22TPE%22]`)
//             .then(async (response) => {
//                 console.log('num of meetups: ', response.data.meetups.length)
//                 console.log(response.data.meetups[0])
//                 console.log('getConnection')



//                 return response
//             })

//             .then(async (response) => {
//                 // console.log('userList 2', response.data.userList)
//                 // console.log('num of meetups: 2', response.data.meetups.length)

//                 let result
//                 let userId
//                 const conn = await pool.getConnection();
//                 for (let i in response.data.meetups) {


//                     let binding = {
//                         id: response.data.meetups[i].ID,
//                         cover: response.data.meetups[i].cover,
//                         host_id: response.data.meetups[i].host.ID,
//                     }

//                     result = await conn.query('INSERT INTO gathering_temp set ?', binding);

//                     try {
//                         await axios.get(`https://api.eatgether.io/v4.0/meetup/applicants/${response.data.meetups[i].ID}`)
//                             .then(async (participant) => {


//                                 for (let j in participant.data.applicants) {
//                                     let binding2 = {
//                                         id: response.data.meetups[i].ID,
//                                         participant_id: participant.data.applicants[j].ID,
//                                     }

//                                     await conn.query('INSERT INTO participant_temp set ?', binding2);



//                                 }



//                             })
//                     } catch {
//                         console.log('no participant')
//                     }



//                 }

//                 await conn.release();
//                 console.log('finished inserting data')



//             })





//             .catch((error) => {
//                 if (error.response) {
//                     // When response status code is out of 2xx range 
//                     // console.log(error.response.data)
//                     console.log(error.response.status)
//                     console.log(error.response.headers)
//                 } else if (error.request) {
//                     // When no response was recieved after request was made
//                     console.log(error.request)
//                 } else {
//                     // Error
//                     console.log(error.message)
//                 }
//             })