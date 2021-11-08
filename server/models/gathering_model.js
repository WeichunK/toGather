const { pool } = require('./mysqlcon');

// const express = require('express');
// const app = express();

// // const app = require('../../app')
// const http = require('http');
// // const server = http.createServer(app);


// const server = require('../../app')
// const { Server } = require("socket.io");
// // const io = new Server(server);


// const io = require("socket.io")(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"],
//         allowedHeaders: ["my-custom-header"],
//         credentials: true
//     }
// });

// const { io } = require("../../app")


const getGatherings = async (pageSize, paging = 0, requirement = {}) => {
    // const conn = await pool.getConnection();
    let result;
    const query = { sql: '', binding: [], condition: '' };
    if (requirement.keyword != null) {
        query.sql = 'select g.*, m.email, m.name, m.gender, m.age, m.introduction, m.job, m.title AS host_title, m.picture as host_pic, m.popularity, m.coin, (case when r.avg_rating is null then 3 else r.avg_rating end)+log10(case when c.click_count is null then 1 else c.click_count+1 end) as rating from gathering g \
        left join member m on g.host_id = m.id \
        left join (select host_id, sum(rating)/count(rating) as avg_rating from feedback group by host_id) r on r.host_id = g.host_id \
        left join (select gathering_id, count(*) as click_count from tracking_click_gathering group by gathering_id) c on c.gathering_id = g.id ';
        query.condition = 'WHERE g.title LIKE ? ORDER BY rating DESC;'
        query.binding = [`%${requirement.keyword}%`];
    } else if (requirement.boundary != null) {
        query.sql = 'select g.*, m.email, m.name, m.gender, m.age, m.introduction, m.job, m.title AS host_title, m.picture as host_pic, m.popularity, m.coin, (case when r.avg_rating is null then 3 else r.avg_rating end)+log10(case when c.click_count is null then 1 else c.click_count+1 end) as rating from gathering g \
        left join member m on g.host_id = m.id \
        left join (select host_id, sum(rating)/count(rating) as avg_rating from feedback group by host_id) r on r.host_id = g.host_id \
        left join (select gathering_id, count(*) as click_count from tracking_click_gathering group by gathering_id) c on c.gathering_id = g.id ';
        query.condition = 'WHERE g.lng BETWEEN ? AND ? AND g.lat BETWEEN ? AND ? ORDER BY rating DESC;'
        query.binding = requirement.boundary;


    } else if (requirement.id != null) {
        query.sql = 'SELECT g.*, m.email, m.name, m.gender, m.age, m.introduction, m.job, m.title AS host_title, m.picture AS host_pic, m.popularity ,m.coin FROM gathering g LEFT JOIN member m ON g.host_id = m.id '
        query.condition = 'WHERE g.id = ?;'
        query.binding = [requirement.id];

    }


    const gatheringQuery = query.sql + query.condition;
    console.log('query')

    result = await pool.query(gatheringQuery, query.binding);

    return result[0];

    // try {
    //     // await conn.query('START TRANSACTION');
    //     // const [result] = await conn.query('INSERT INTO product SET ?', product);
    //     // await conn.query('INSERT INTO variant(product_id, color_id, size, stock) VALUES ?', [variants]);
    //     // await conn.query('INSERT INTO product_images(product_id, image) VALUES ?', [images]);
    //     // await conn.query('COMMIT');
    //     if (Hbg) {
    //         console.log('model query', Hbg, Hbi, tcg, tci)
    //         let binding = [Hbg, Hbi, tcg, tci]
    //         result = await conn.query('select * from gathering where lng between ? AND ? AND lat between ? and ?;', binding)
    //     } else {
    //         result = await conn.query('select * from gathering')
    //     }
    //     console.log('result', result[0])



    //     return result[0];
    // } catch (error) {
    //     await conn.query('ROLLBACK');
    //     console.log(error)
    //     return -1;
    // } finally {
    //     await conn.release();
    // }
};



const getParticipants = async (pageSize, paging = 0, requirement = {}) => {


    let result;
    const condition = { sql: '', binding: [], order: '' };
    if (requirement.id != null) {
        condition.sql = 'having gathering_id = ?';
        condition.binding = [requirement.id];
        condition.order = ';'
    }


    const gatheringQuery = 'SELECT p.participant_id as id, p.gathering_id, m.name as user_name FROM participant p left join member m on p.participant_id = m.id ' + condition.sql + condition.order;

    result = await pool.query(gatheringQuery, condition.binding);

    return result[0];


}


// const getGatheringDetail = async (gatheringId) => {

//     try {

//         const [gathering] = await pool.query('SELECT * FROM member_2 WHERE id = ?', [gatheringId]);
//         console.log('users[0] ', gathering[0])
//         return gathering[0];

//     } catch (e) {
//         return null;
//     }

// }

const hostGathering = async (gathering) => {


    const conn = await pool.getConnection();

    try {
        await conn.query('START TRANSACTION');

        gathering.created_at = new Date();
        gathering.status = 1;

        const queryStr = 'INSERT INTO gathering SET ?';
        const [result] = await conn.query(queryStr, gathering);

        // gathering.id = result.insertId;
        await conn.query('COMMIT');
        return result;
    } catch (error) {
        console.log(error);
        await conn.query('ROLLBACK');
        return { error };
    } finally {
        // io.emit('updateGatheringList', 'DB updated');
        await conn.release();

    }

}


const attendGathering = async (participant, action) => {

    const conn = await pool.getConnection();
    let queryStr;
    let binding;
    try {
        await conn.query('START TRANSACTION');
        let binding;
        if (action == 'join') {
            participant.created_at = new Date();
            queryStr = 'INSERT INTO participant SET ?';
            binding = participant;
            console.log('binding', binding)


        } else if (action == 'quit') {

            queryStr = 'DELETE FROM participant where gathering_id = ? and participant_id =?;';
            binding = [participant.gathering_id, participant.participant_id]


        }

        let [result] = await conn.query(queryStr, binding);
        // gathering.id = result.insertId;
        await conn.query('COMMIT');
        return result;
    } catch (error) {
        console.log(error);
        await conn.query('ROLLBACK');
        return { error };
    } finally {
        // io.emit('updateGatheringList', 'DB updated');
        await conn.release();


    }

}




const postFeedback = async (feedback) => {


    const conn = await pool.getConnection();

    try {
        await conn.query('START TRANSACTION');

        feedback.created_at = new Date();


        const queryStr = 'INSERT INTO feedback SET ?';
        const [result] = await conn.query(queryStr, feedback);

        // gathering.id = result.insertId;
        await conn.query('COMMIT');
        return result;
    } catch (error) {
        console.log(error);
        await conn.query('ROLLBACK');
        return { error };
    } finally {
        // io.emit('updateGatheringList', 'DB updated');
        await conn.release();

    }

}




module.exports = {
    getGatherings,
    // getGatheringDetail,
    getParticipants,
    hostGathering,
    attendGathering,
    postFeedback,
    // getHotProducts,
    // getProductsVariants,
    // getProductsImages,
};