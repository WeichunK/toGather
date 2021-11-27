require('dotenv').config();
const bcrypt = require('bcrypt');
const { pool } = require('./mysqlcon');
const salt = parseInt(process.env.BCRYPT_SALT);
const { TOKEN_EXPIRE, TOKEN_SECRET } = process.env; // 30 days by seconds
const jwt = require('jsonwebtoken');

const USER_ROLE = {
    ALL: 1,
    ADMIN: 999,
    PREMIUM_USER: 2,
    FREE: 3,
};

const signUp = async (name, email, password, provider, role) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');
        const emails = await conn.query('SELECT email FROM member WHERE email = ? FOR UPDATE', [email]);
        if (emails[0].length > 0) {
            await conn.query('COMMIT');
            return { error: 'This Email Already Exists' };
        }

        const loginAt = new Date();
        const user = {
            provider: provider,
            role: role,
            email: email,
            password: bcrypt.hashSync(password, salt),
            name: name,
            picture: 'https://my-personal-project-bucket.s3.ap-northeast-1.amazonaws.com/img/member/default_head_person_icon.png',
            popularity: 30,
            access_expired: TOKEN_EXPIRE,
            login_at: loginAt
        };
        const accessToken = jwt.sign({
            provider: user.provider,
            name: user.name,
            email: user.email,
            picture: user.picture,
            expiresIn: user.access_expired
        }, TOKEN_SECRET);
        user.access_token = accessToken;
        const queryStr = 'INSERT INTO member SET ?';
        const [result] = await conn.query(queryStr, user);
        user.id = result.insertId;
        await conn.query('COMMIT');
        return { user };
    } catch (error) {
        console.log(error);
        await conn.query('ROLLBACK');
        return { error };
    } finally {
        await conn.release();
    }
}

const nativeSignIn = async (email, password) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');
        console.log('query email', email)
        const [users] = await conn.query('SELECT * FROM member WHERE email = ?', [email]);
        console.log('query result', users[0])
        const user = users[0];
        if (!bcrypt.compareSync(password, user.password)) {
            await conn.query('COMMIT');
            return { error: 'Wrong Password!' };
        }
        console.log('parseInt(user.popularity) + 1', parseInt(user.popularity) + 1)
        const loginAtOld = user.login_at
        const loginAt = new Date();
        const accessToken = jwt.sign({
            provider: user.provider,
            name: user.name,
            email: user.email,
            picture: user.picture,
            expiresIn: TOKEN_EXPIRE
        }, TOKEN_SECRET);

        if (loginAtOld.getMinutes() != loginAt.getMinutes()) {
            user.bonus = true
            const queryStr = 'UPDATE member SET access_token = ?, access_expired = ?, login_at = ?, popularity = ? WHERE id = ?';
            await conn.query(queryStr, [accessToken, TOKEN_EXPIRE, loginAt, parseInt(user.popularity) + 1, user.id]);

        } else {
            user.bonus = false
            const queryStr = 'UPDATE member SET access_token = ?, access_expired = ?, login_at = ? WHERE id = ?';
            await conn.query(queryStr, [accessToken, TOKEN_EXPIRE, loginAt, user.id]);
        }
        await conn.query('COMMIT');
        user.access_token = accessToken;
        user.login_at = loginAt;
        user.access_expired = TOKEN_EXPIRE;
        return { user };
    } catch (error) {
        await conn.query('ROLLBACK');
        return { error };
    } finally {
        await conn.release();
    }
};

const getUserDetail = async (userEmail, roleId) => {
    try {
        if (roleId) {
            const [users] = await pool.query('SELECT * FROM member WHERE email = ? AND role = ?', [userEmail, roleId]);
            return users[0];
        } else {
            const [users] = await pool.query('SELECT * FROM member WHERE email = ?', [userEmail]);
            return users[0];
        }
    } catch (e) {
        return null;
    }
};

const getProfile = async (userId) => {
    try {
        const [users] = await pool.query('SELECT * FROM member WHERE id = ?', [userId]);
        return users[0];
    } catch (e) {
        return null;
    }
};

const getUserGatheringList = async (userEmail, roleId) => {
    try {
        if (roleId) {
            const [users] = await pool.query('SELECT * FROM member WHERE email = ? AND role = ?', [userEmail, roleId]);
            return users[0];
        } else {
            const [users] = await pool.query('SELECT * FROM member WHERE email = ?', [userEmail]);
            return users[0];
        }
    } catch (e) {
        return null;
    }
};

const getUserRating = async (userId) => {
    console.log('user_id', userId)
    let result;
    try {
        console.log('try')
        const [users] = await pool.query('SELECT host_id, AVG(rating) AS rating FROM feedback group by host_id having host_id = ?', [userId]);
        if (users[0]) {
            result = users[0]
        } else {
            result = { user_id: userId, rating: 0 }
        }
        return result;
    } catch (e) {
        return null;
    }
}

const updatePhoto = async (photo, user_id) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('START TRANSACTION');
        const queryStr = 'UPDATE member SET ? WHERE id = ?';
        const [result] = await conn.query(queryStr, [photo, user_id]);
        await conn.query('COMMIT');
        return result;
    } catch (error) {
        console.log(error);
        await conn.query('ROLLBACK');
        return { error };
    } finally {
        await conn.release();
    }
}
module.exports = {
    USER_ROLE,
    signUp,
    nativeSignIn,
    getUserDetail,
    getProfile,
    getUserGatheringList,
    getUserRating,
    updatePhoto,
}