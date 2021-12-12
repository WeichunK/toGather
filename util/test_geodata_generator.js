const mysql = require('mysql2/promise')



var args = process.argv.slice(2);




require('dotenv').config();


const multipleStatements = (process.env.NODE_ENV === 'test');
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_DATABASE_TEST } = process.env;


const mysqlConfig = {
    gen: { // for EC2 machine
        host: 'localhost',
        user: 'testuser',
        password: 'test1234',
        database: 'spatial_test'
    }
};

let mysqlEnv = mysqlConfig['gen'];
mysqlEnv.waitForConnections = true;
mysqlEnv.connectionLimit = 20;

const pool = mysql.createPool(mysqlEnv, { multipleStatements });









// const outputNum = 40000

const outputNum = args[0]

function getRandom(min, max) {
    return (Math.random() * (max - min)) + min;
}



// let gatheringTemplate = {
//         title: 'gathering1',
//         description: 'gathering1',
//         category: '美食美酒',
//         picture: 'https://my-personal-project-bucket.s3.ap-northeast-1.amazonaws.com/gathering/%E4%B8%8B%E8%BC%89+(1).jpeg',
//         host_id: 1,
//         start_at: new Date('2022-01-01'),
//         created_at: new Date('2021-11-01'),
//         max_participant: 4,
//         remaining_quota: 2,
//         place: 'place1',
//         lng: 121.5624462,
//         lat: 25.02230243511096,
//         status: 1

// }



async function _createFakeOrder(conn) {

    // let sql = 'INSERT INTO order_list (order_id, order_info, list_info, user_id, total, payment_status) VALUES (?, ?, ?, ?, ?, ?);'

    // var today = new Date()

    let gatherings = []
    let points = []

    for (let i = 0; i < outputNum; i++) {
        let lng = getRandom(121.4, 121.6)
        let lat = getRandom(24.9, 25.09)
        // let point = [{ lng: lng, lat: lat, }];

        let point = `point(${lng} ${lat})`
        // console.log('point', point)
        // points.push(point)

        // let gathering = {
        //     title: 'gathering' + i,
        //     description: 'gathering' + i,
        //     category: '美食美酒',
        //     picture: 'https://my-personal-project-bucket.s3.ap-northeast-1.amazonaws.com/gathering/%E4%B8%8B%E8%BC%89+(1).jpeg',
        //     host_id: 1,
        //     start_at: new Date('2022-01-01'),
        //     created_at: new Date('2021-11-01'),
        //     max_participant: 4,
        //     remaining_quota: 2,
        //     place: 'place1',
        //     lng: lng,
        //     lat: lat,
        //     status: 1,
        //     gis: points
        // };



        // gatherings.push(gathering)
        await conn.query(`INSERT INTO gathering (title, description, category, lng, lat, gis) VALUES ('gathering_${i}', 'gathering_${i}', '美食美酒',${lng},${lat},ST_GeomFromText('${point}'));`);


    }

    // return await conn.query('INSERT INTO gathering (title,description,category,picture,host_id,start_at,created_at,max_participant,remaining_quota,place,lng,lat,status,gis) VALUES ?', [gatherings.map(x => Object.values(x))]);



}

async function createFakeData() {
    const conn = await pool.getConnection();
    await conn.query('START TRANSACTION');
    console.log('START TRANSACTION')
    await _createFakeOrder(conn);
    await conn.query('COMMIT');
    await conn.release();
    console.log('Finished')
}



// TRUNCATE TABLE      ;

async function truncateFakeData() {
    const truncateTable = async (table) => {
        const conn = await pool.getConnection();
        await conn.query('START TRANSACTION');
        await conn.query('SET FOREIGN_KEY_CHECKS = ?', 0);
        await conn.query(`TRUNCATE TABLE ${table}`);
        await conn.query('SET FOREIGN_KEY_CHECKS = ?', 1);
        await conn.query('COMMIT');
        await conn.release();
        return;
    }
}



const result = createFakeData()



