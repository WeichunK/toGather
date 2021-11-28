const { pool } = require('./mysqlcon');

const clickGatheringList = async (gatheringId, userId) => {
    const conn = await pool.getConnection();
    let trackingData = { gathering_id: gatheringId, user_id: userId }
    try {
        await conn.query('START TRANSACTION');
        trackingData.created_at = new Date();
        const queryStr = 'INSERT INTO tracking_click_gathering SET ?';
        const [trackingResult] = await conn.query(queryStr, trackingData);
        // gathering.id = result.insertId;
        await conn.query('COMMIT');
        return trackingResult;
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
    clickGatheringList,
};