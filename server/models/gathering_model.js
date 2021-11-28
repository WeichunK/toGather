const { pool } = require('./mysqlcon');
const { REQUITED_POPULARITY } = process.env;
const GATHERING_STATUS = {
    INITIAL: 1,
    ACTIVE: 2,
    FULL: 3,
    END: 4,
};

const getGatherings = async (requirement = {}) => {
    let gatherings;
    const query = { sql: '', binding: [], condition: '' };
    if (requirement.boundary != null) {
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
    gatherings = await pool.query(gatheringQuery, query.binding);
    return gatherings[0];
};

const getParticipants = async (requirement = {}) => {
    let participants;
    const condition = { sql: '', binding: [], order: '' };
    if (requirement.id != null) {
        condition.sql = 'having gathering_id = ?';
        condition.binding = [requirement.id];
        condition.order = ';'
    }
    const gatheringQuery = 'SELECT p.participant_id as id, p.gathering_id, m.name as user_name, m.picture FROM participant p left join member m on p.participant_id = m.id ' + condition.sql + condition.order;
    participants = await pool.query(gatheringQuery, condition.binding);
    return participants[0];
}

const hostGathering = async (gathering) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');
        gathering.created_at = new Date();
        gathering.status = GATHERING_STATUS.INITIAL;
        const queryStr = 'INSERT INTO gathering SET ?';
        const [hostResult] = await conn.query(queryStr, gathering);
        await conn.query('COMMIT');
        return hostResult;
    } catch (error) {
        console.log(error);
        await conn.query('ROLLBACK');
        return { error };
    } finally {
        await conn.release();
    }
}

const attendGathering = async (participant, action) => {
    const conn = await pool.getConnection();
    let queryStr;
    try {
        await conn.query('START TRANSACTION');
        let binding;
        let popularity
        if (action == 'join') {
            const [quota] = await conn.query('select remaining_quota from gathering where id = ? for update;', [participant.gathering_id]);
            if (quota[0].remaining_quota <= 0) {
                console.log('No seats')
                return { error: 'Participant Full!' };
            }
            const [users] = await conn.query('SELECT * FROM member WHERE id = ?', [participant.participant_id]);
            const user = users[0];
            popularity = parseInt(user.popularity)
            console.log('parseInt(user.popularity)', popularity)
            if (popularity < parseInt(REQUITED_POPULARITY)) {
                return { error: 'Not Enough Popularity!' };
            }
            await conn.query('UPDATE gathering set remaining_quota = ? where id = ?', [quota[0].remaining_quota - 1, participant.gathering_id]);
            participant.created_at = new Date();
            queryStr = 'INSERT INTO participant SET ?';
            binding = participant;
            console.log('binding', binding)
        } else if (action == 'quit') {
            const [quota] = await conn.query('select remaining_quota from gathering where id = ? for update;', [participant.gathering_id]);
            await conn.query('UPDATE gathering set remaining_quota = ? where id = ?', [quota[0].remaining_quota + 1, participant.gathering_id]);
            queryStr = 'DELETE FROM participant where gathering_id = ? and participant_id =?;';
            binding = [participant.gathering_id, participant.participant_id]
        }
        let [participantResult] = await conn.query(queryStr, binding);
        if (action == 'join') {
            console.log('popularity', popularity)
            const queryStr = 'UPDATE member SET popularity = ? WHERE id = ?';
            await conn.query(queryStr, [popularity - REQUITED_POPULARITY, participant.participant_id]);
        }
        let secondQuery = "select g.id, g.max_participant, g.min_participant, (case when p.num_participant is null then 0 else p.num_participant end) AS num_participant from gathering g \
        left join (select gathering_id, count(participant_id) as num_participant from participant group by gathering_id) p on g.id = p.gathering_id where g.id = ?;"
        let gathering = await conn.query(secondQuery, [participant.gathering_id]);
        let statusCode = {}
        if (gathering[0][0].num_participant == gathering[0][0].max_participant) {
            statusCode.status = GATHERING_STATUS.FULL;
        } else if (gathering[0][0].num_participant == 0) {
            statusCode.status = GATHERING_STATUS.INITIAL;
        } else {
            statusCode.status = GATHERING_STATUS.ACTIVE;
        }
        await conn.query('UPDATE gathering set ?  where id = ?', [statusCode, participant.gathering_id])
        await conn.query('COMMIT');
        return participantResult;
    } catch (error) {
        console.log(error);
        await conn.query('ROLLBACK');
        return { error };
    } finally {
        await conn.release();
    }
}

const postFeedback = async (feedback) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');
        feedback.created_at = new Date();
        const queryStr = 'INSERT INTO feedback SET ?';
        const [postResult] = await conn.query(queryStr, feedback);
        await conn.query('COMMIT');
        return postResult;
    } catch (error) {
        console.log(error);
        await conn.query('ROLLBACK');
        return { error };
    } finally {
        await conn.release();
    }
}

const getComment = async (gatheringId) => {
    let comments;
    const Query = 'SELECT user_id, m.name, f.created_at, comment from feedback f \
    left join member m on f.user_id = m.id \
    where gathering_id = ? and comment !="";'
    comments = await pool.query(Query, [gatheringId]);
    return comments[0];
}

module.exports = {
    getGatherings,
    getParticipants,
    hostGathering,
    attendGathering,
    postFeedback,
    getComment,
};