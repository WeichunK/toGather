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



const pool = mysql.createPool(mysqlConfig, { multipleStatements });

// 美食 電影 運動戶外 讀書會 桌遊 其他

axios.get(`https://api.eatgether.io/v4.0/meetup/list/TW?cities=[%22NWT%22,%22TPE%22]`)
    .then(async (response) => {
        console.log('num of meetups: ', response.data.meetups.length)
        console.log(response.data.meetups[0])


        let userList
        const conn = await pool.getConnection();
        console.log('getConnection')



        return response
    })

    .then(async (response) => {
        // console.log('userList 2', response.data.userList)
        // console.log('num of meetups: 2', response.data.meetups.length)

        const hash = crypto.createHash('sha256')

        hash.update('test123')
        let encryptedPWD = hash.digest('hex')

        let result
        let userId
        conn = await pool.getConnection();
        for (let i in response.data.meetups) {
            userList = await conn.query('select username from member;');
            userList = userList[0].map(x => x.username)
            // console.log('userList', userList)
            // await conn.release();

            response.data.userList = userList
            // console.log('i', i)
            if (response.data.userList.indexOf(response.data.meetups[i].host.nickname) == -1) {
                // console.log('response.data.meetups[i].host.nickname', i, response.data.meetups[i].host.nickname)




                const config = {
                    headers: { 'authorization': 'BEARER eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhMDk2NTY0ZS00OTBkLTQ5OTEtOTI3Yy0yOGUyOGUyNGIxMWEiLCJleHAiOjE5NDk1MzY0MTUsImlhdCI6MTYzNDE3NjQxNSwiaXNzIjoiaHR0cHM6Ly9lYXRnZXRoZXIuaW8iLCJuYmYiOjE2MzQxNzY0MTUsInN1YiI6ImFwLXNvdXRoZWFzdC0xOmY0YWY4N2Y4LWIyYmItNDIwYy1hYWUzLTEwMjc2MzJlMTNhNCJ9.LMQNvHyzxtwufKdTNYlqDlyYB79YQZLFUzxniztb8T-DxfqE5nQ8U_4wYpACssDOBFu0lsDohiS4cTDzURSbxw' }
                }



                await axios.get(`https://api.eatgether.io/v4.0/member/profile/${response.data.meetups[i].host.ID}?language=zh-TW`, config)
                    .then(async (host) => {

                        let binding = {
                            username: response.data.meetups[i].host.nickname,
                            email: 'test' + (userList.length + 1) + '@test.com',
                            job: host.data.member.profile.job,
                            title: host.data.member.profile.jobTitle,
                            gender: host.data.member.profile.gender,
                            age: host.data.member.profile.age,
                            introduction: host.data.member.profile.introduction,
                            picture: `https://cdn.eatgether.com/member/${response.data.meetups[i].host.ID}/avatar/${response.data.meetups[i].host.avatar}`,
                            role: 1,
                            provider: 'native',
                            password: encryptedPWD,

                        }

                        result = await conn.query('INSERT INTO member  set ?', binding);


                        // console.log('result.insertId', result[0].insertId)
                        userId = result[0].insertId;

                    })




            } else {

                result = await conn.query('select id from member where username=?', response.data.meetups[i].host.nickname);

                userId = result[0][0].id;
            }

            // console.log('response.data.meetups[i].ID', response.data.meetups[i].ID)
            // console.log(`https://api.eatgether.io/v4.0/meetup/view/${response.data.meetups[i].ID}?language=zh-TW`)
            axios.get(`https://api.eatgether.io/v4.0/meetup/view/${response.data.meetups[i].ID}?language=zh-TW`)
                .then(async (event) => {

                    console.log('time', new Date().toISOString().slice(0, 19).replace('T', ' '));
                    console.log('time2', new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' '))
                    binding = {
                        title: event.data.meetup.title,
                        category: event.data.meetup.categoryName,
                        description: event.data.meetup.content,
                        picture: `https://cdn.eatgether.com/meetup/${response.data.meetups[i].ID}/cover/${response.data.meetups[i].cover}`,
                        host_id: userId,
                        start_on: new Date(+new Date(event.data.meetup.startOn) + 8 * 3600 * 1000).toLocaleDateString('zh-TW').slice(0, 19).replace('T', ' '),


                        created_on: new Date().toISOString().slice(0, 19).replace('T', ' '),
                        max_participant: event.data.meetup.numberOfPeople,
                        min_participant: 2,
                        place: event.data.meetup.place.address,
                        lng: 0,
                        lat: 0,
                        status: 1,


                    }

                    let inserGathering = await conn.query('INSERT INTO gathering  set ?', binding);
                    console.log('inserGathering', inserGathering)
                    response.data.inserGathering = inserGathering[0].insertId
                    return response
                })

                .then(async (response) => {

                    axios.get(`https://api.eatgether.io/v4.0/meetup/applicants/${response.data.meetups[i].ID}`)
                        .then(async (participant) => {
                            try {

                                const config = {
                                    headers: { 'authorization': 'BEARER eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhMDk2NTY0ZS00OTBkLTQ5OTEtOTI3Yy0yOGUyOGUyNGIxMWEiLCJleHAiOjE5NDk1MzY0MTUsImlhdCI6MTYzNDE3NjQxNSwiaXNzIjoiaHR0cHM6Ly9lYXRnZXRoZXIuaW8iLCJuYmYiOjE2MzQxNzY0MTUsInN1YiI6ImFwLXNvdXRoZWFzdC0xOmY0YWY4N2Y4LWIyYmItNDIwYy1hYWUzLTEwMjc2MzJlMTNhNCJ9.LMQNvHyzxtwufKdTNYlqDlyYB79YQZLFUzxniztb8T-DxfqE5nQ8U_4wYpACssDOBFu0lsDohiS4cTDzURSbxw' }
                                }
                                let applicantList = {}
                                for (let j in participant.data.applicants) {

                                    axios.get(`https://api.eatgether.io/v4.0/member/profile/${participant.data.applicants[j].ID}?language=zh-TW`, config)
                                        .then(async (member) => {


                                            userList = await conn.query('select username from member;');
                                            userList = userList[0].map(x => x.username)
                                            // console.log('userList', userList)
                                            // await conn.release();

                                            response.data.userList = userList

                                            if (response.data.userList.indexOf(member.data.member.profile.nickname) == -1) {

                                                axios.get(`https://api.eatgether.io/v4.0/member/avatar/${participant.data.applicants[j].ID}`, config)
                                                    .then(async (avatar) => {


                                                        let binding = {
                                                            username: member.data.member.profile.nickname,
                                                            email: 'test' + (userList.length + 1) + '@test.com',
                                                            job: member.data.member.profile.job,
                                                            title: member.data.member.profile.jobTitle,
                                                            gender: member.data.member.profile.gender,
                                                            age: member.data.member.profile.age,
                                                            introduction: member.data.member.profile.introduction,
                                                            picture: `https://cdn.eatgether.com/member/${member.data.member.ID}/avatar/${avatar.data.avatars[0]}`,
                                                            role: 1,
                                                            provider: 'native',
                                                            password: encryptedPWD,

                                                        }

                                                        result = await conn.query('INSERT INTO member  set ?', binding);
                                                        console.log('result.insertId3', result[0])
                                                        applicantList.applicant = result[0].insertId
                                                    })






                                            } else {


                                                result = await conn.query('select id from member where username=?', member.data.member.profile.nickname);
                                                console.log('result[0][0].id4', result[0][0])
                                                applicantList.applicant = result[0][0].id;


                                            }

                                            console.log('applicantList.applicant', applicantList.applicant)
                                            binding =
                                            {
                                                gathering_id: response.data.inserGathering,
                                                participant_id: applicantList.applicant
                                            }


                                            await conn.query('INSERT INTO participant set ?', binding);


                                        })


                                }

                            } catch {
                                console.log('no applicant')
                            }


                        })

                })




        }



        await conn.release();
        console.log('finished inserting data')
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