const { pool } = require('./mysqlcon');
const redis = require('redis')
const redisClient = redis.createClient(6379, 'redisforstylish.jqypcs.0001.apne1.cache.amazonaws.com', { no_ready_check: true })

const getGatherings = async (pageSize, paging = 0, requirement = {}) => {
    // const conn = await pool.getConnection();
    let result;
    const query = { sql: '', binding: [], condition: '' };
    if (requirement.keyword != null) {
        console.log('keyword')
        query.sql = 'SELECT g.*, m.email, m.name, m.gender, m.age, m.introduction, m.job, m.title AS host_title, m.picture as host_pic, m.popularity, m.coin, (case when r.avg_rating is null then 3 else r.avg_rating end)+log10(case when c.click_count is null then 1 else c.click_count+1 end) as rating from gathering g \
        LEFT JOIN member m on g.host_id = m.id \
        LEFT JOIN (select host_id, sum(rating)/count(rating) as avg_rating from feedback group by host_id) r on r.host_id = g.host_id \
        LEFT JOIN (select gathering_id, count(*) as click_count from tracking_click_gathering group by gathering_id) c on c.gathering_id = g.id ';
        query.condition = 'WHERE g.title LIKE ? ORDER BY rating DESC;'
        query.binding = [`%${requirement.keyword}%`];
    } else if (requirement.boundary != null) {
        // console.log('boundary')
        query.sql = 'SELECT g.*, m.email, m.name, m.gender, m.age, m.introduction, m.job, m.title AS host_title, m.picture as host_pic, m.popularity, m.coin, (case when r.avg_rating is null then 3 else r.avg_rating end)+log10(case when c.click_count is null then 1 else c.click_count+1 end) as rating from gathering g \
        LEFT JOIN member m on g.host_id = m.id \
        LEFT JOIN (select host_id, sum(rating)/count(rating) as avg_rating from feedback group by host_id) r on r.host_id = g.host_id \
        LEFT JOIN (select gathering_id, count(*) as click_count from tracking_click_gathering group by gathering_id) c on c.gathering_id = g.id ';
        query.condition = 'WHERE g.lng BETWEEN ? AND ? AND g.lat BETWEEN ? AND ? ORDER BY rating DESC;'
        query.binding = requirement.boundary;


    } else if (requirement.id != null) {
        // console.log('id')
        query.sql = 'SELECT g.*, m.email, m.name, m.gender, m.age, m.introduction, m.job, m.title AS host_title, m.picture AS host_pic, m.popularity ,m.coin, (case when r.avg_rating is null then 0 else r.avg_rating end) AS avg_rating FROM gathering g \
        LEFT JOIN member m ON g.host_id = m.id \
        LEFT JOIN (select host_id, sum(rating)/count(rating) as avg_rating from feedback group by host_id) r on r.host_id = g.host_id '
        query.condition = 'WHERE g.id = ?;'
        query.binding = [requirement.id];

    } else if (requirement.userId != null) {
        // console.log('userId')
        query.sql = 'SELECT p.*, g.*, m.email, m.name, m.gender, m.age, m.introduction, m.job, m.title AS host_title, m.picture as host_pic, m.popularity, m.coin, r.avg_rating as rating, c.click_count as click_count from participant p \
        LEFT JOIN gathering g on p.gathering_id = g.id \
        LEFT JOIN member m on g.host_id = m.id \
        LEFT JOIN (select host_id, sum(rating)/count(rating) as avg_rating from feedback group by host_id) r on r.host_id = g.host_id \
        LEFT JOIN (select gathering_id, count(*) as click_count from tracking_click_gathering group by gathering_id) c on c.gathering_id = g.id '
        query.condition = 'WHERE participant_id = ? ORDER BY start_at;'
        query.binding = [requirement.userId];

    } else if (requirement.hostId != null) {
        // console.log('hostId')
        query.sql = 'SELECT g.*, (case when p.participant_count is null then 0 else p.participant_count end) AS participant_count, (case when c.click_count is null then 0 else c.click_count end) AS click_count from gathering g \
        LEFT JOIN (select gathering_id, count(participant_id) as participant_count from participant group by gathering_id) p on p.gathering_id = g.id \
        LEFT JOIN (select gathering_id, count(*) as click_count from tracking_click_gathering group by gathering_id) c on c.gathering_id = g.id '
        query.condition = 'WHERE host_id = ? ORDER BY start_at;'
        query.binding = [requirement.hostId];

    }

    const gatheringQuery = query.sql + query.condition;
    // console.log('query', gatheringQuery)

    result = await pool.query(gatheringQuery, query.binding);

    return result[0];

};



const getParticipants = async (pageSize, paging = 0, requirement = {}) => {

    let result;
    const condition = { sql: '', binding: [], order: '' };
    if (requirement.id != null) {
        condition.sql = 'having gathering_id = ?';
        condition.binding = [requirement.id];
        condition.order = ';'
    }

    const gatheringQuery = 'SELECT p.participant_id as id, p.gathering_id, m.name as user_name, m.picture FROM participant p left join member m on p.participant_id = m.id ' + condition.sql + condition.order;

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

        // --------- 30 點獎勵-----------

        // const [users] = await conn.query('SELECT * FROM member WHERE id = ?', [gathering.host_id]);
        // const user = users[0];
        // let popularity = parseInt(user.popularity)
        // console.log('parseInt(user.popularity)', popularity)

        // await conn.query('UPDATE member SET popularity = ? WHERE id = ?', [popularity + 30, gathering.host_id]);
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
        let popularity
        if (action == 'join') {
            console.log('participant.participant_id', participant.gathering_id)
            // const [numOfParticipant] = await conn.query('select p.gathering_id, p.num_participant, g.max_participant from ( select gathering_id, count(participant_id) as num_participant \
            // from participant group by(gathering_id))p left join gathering g on p. gathering_id = g.id where gathering_id = ?;', [participant.gathering_id]);
            // console.log('numOfParticipant', numOfParticipant)

            // if (numOfParticipant.length != 0) {
            //     if (numOfParticipant[0].num_participant >= numOfParticipant[0].max_participant) {
            //         console.log('No seats')
            //         return { error: 'Participant Full!' };
            //     }
            // }

            const [quota] = await conn.query('select remaining_quota from gathering where id = ? for update;', [participant.gathering_id]);
            console.log('quota[0]', quota[0])

            if (quota[0].remaining_quota <= 0) {
                console.log('No seats')
                return { error: 'Participant Full!' };
            }


            const [users] = await conn.query('SELECT * FROM member WHERE id = ?', [participant.participant_id]);
            const user = users[0];
            popularity = parseInt(user.popularity)
            console.log('parseInt(user.popularity)', popularity)

            if (popularity < 5) {
                return { error: 'Not Enough Popularity!' };
            }

            console.log('quota[0].quota - 1', quota[0].remaining_quota)


            let [resultQuota] = await conn.query('UPDATE gathering set remaining_quota = ? where id = ?', [quota[0].remaining_quota - 1, participant.gathering_id]);




            participant.created_at = new Date();
            queryStr = 'INSERT INTO participant SET ?';
            binding = participant;
            console.log('binding', binding)

        } else if (action == 'quit') {
            const [quota] = await conn.query('select remaining_quota from gathering where id = ? for update;', [participant.gathering_id]);
            let [resultQuota] = await conn.query('UPDATE gathering set remaining_quota = ? where id = ?', [quota[0].remaining_quota + 1, participant.gathering_id]);



            queryStr = 'DELETE FROM participant where gathering_id = ? and participant_id =?;';
            binding = [participant.gathering_id, participant.participant_id]


        }



        let [resultParticipant] = await conn.query(queryStr, binding);

        if (action == 'join') {
            console.log('popularity', popularity)
            const queryStr = 'UPDATE member SET popularity = ? WHERE id = ?';
            await conn.query(queryStr, [popularity - 5, participant.participant_id]);

        }

        let secondQuery = "select g.id, g.max_participant, g.min_participant, (case when p.num_participant is null then 0 else p.num_participant end) AS num_participant from gathering g \
        left join (select gathering_id, count(participant_id) as num_participant from participant group by gathering_id) p on g.id = p.gathering_id where g.id = ?;"

        let gathering = await conn.query(secondQuery, [participant.gathering_id]);

        console.log('gathering[0]_max', gathering[0][0].max_participant)
        console.log('gathering[0]_min', gathering[0][0].min_participant)
        console.log('gathering[0]_num', gathering[0][0].num_participant)

        let statusCode = {}

        if (gathering[0][0].num_participant == gathering[0][0].max_participant) {
            statusCode.status = 3;
        } else if (gathering[0][0].num_participant == 0) {
            statusCode.status = 1;
        } else {
            statusCode.status = 2;
        }

        let updateStatus = await conn.query('UPDATE gathering set ?  where id = ?', [statusCode, participant.gathering_id])

        await conn.query('COMMIT');
        return resultParticipant;
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

// const checkExpiredGathering = async () => {
//     let currentDate = new Date();
// }

const getComment = async (gatheringId) => {
    let result;

    const Query = 'SELECT user_id, m.name, f.created_at, comment from feedback f \
    left join member m on f.user_id = m.id \
    where gathering_id = ? and comment !="";'

    result = await pool.query(Query, [gatheringId]);
    // console.log('result', result)

    return result[0];

}

// const checkGatheringStatus = async () => {
//     async function myfunc() {
//     }
//     const myInterval = setInterval(myfunc, 3000);
//     return;
// }

module.exports = {
    getGatherings,
    getParticipants,
    hostGathering,
    attendGathering,
    postFeedback,
    // checkExpiredGathering,
    getComment,
    // checkGatheringStatus,
};