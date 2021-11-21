const axios = require('axios')
const mysql = require('mysql2/promise');
const multipleStatements = true;
// const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_DATABASE_TEST } = process.env;
const crypto = require('crypto')
const jwt = require('jsonwebtoken')


const mysqlConfig = { // for EC2 machine
    // host: "database-1.cmaisvh7jcso.ap-northeast-1.rds.amazonaws.com",
    // user: "user2",
    // password: "From0825*",
    host: "localhost",
    user: "testuser",
    password: "test1234",
    port: "3306",
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
    database: 'personal_project',
}




// 美食 電影 運動戶外 讀書會 桌遊 其他


const get_data = async (input) => {

    let geo = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(input)}&key=AIzaSyBwLNX2P4gamMMFc7dckwq7LRmVYvmWmDI`)





    console.log('geo', geo.data.results[0].geometry.location.lat,
        geo.data.results[0].geometry.location.lng)

}

get_data('台北市 信義區 101')





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