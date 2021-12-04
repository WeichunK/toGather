require('dotenv').config();
const { expect, requester } = require('./set_up');
const { users } = require('./fake_data');
const sinon = require('sinon');
const { pool } = require('../server/models/mysqlcon');

const expectedExpireTime = process.env.TOKEN_EXPIRE;
const signInTestToken = 'testsigninaccesstoken'
const signInTestEmail = 'testsignin@gmail.com'
const signInTestName = 'testsignin'
const signInTestPicture = 'https://my-personal-project-bucket.s3.ap-northeast-1.amazonaws.com/img/member/default_head_person_icon.png'

describe('user', () => {
    /**
     * Sign Up
     */

    it('sign up', async () => {
        const user = {
            name: 'testsignupuser1',
            email: 'testsignupuser1@gmail.com',
            password: 'password'
        };

        const res = await requester
            .post('/api/1.0/user/signup')
            .send(user);

        const data = res.body.data;

        const userExpected = {
            id: data.user.id,
            provider: 'native',
            name: user.name,
            email: user.email,
            picture: null
        };

        expect(data.user).to.deep.equal(userExpected);
        expect(data.access_token).to.be.a("string")
        expect(data.access_expired).to.equal(expectedExpireTime);
        expect(new Date(data.login_at).getTime()).to.closeTo(Date.now(), 1000);
    });

    it('sign up without name or email or password', async () => {
        const user1 = {
            email: 'testsignupuser1@gmail.com',
            password: 'password'
        };

        const res1 = await requester
            .post('/api/1.0/user/signup')
            .send(user1);

        expect(res1.statusCode).to.equal(400);

        const user2 = {
            name: 'testsignupuser1',
            password: 'password'
        };

        const res2 = await requester
            .post('/api/1.0/user/signup')
            .send(user2);

        expect(res2.statusCode).to.equal(400);

        const user3 = {
            name: 'testsignupuser1',
            email: 'testsignupuser1@gmail.com',
        };

        const res3 = await requester
            .post('/api/1.0/user/signup')
            .send(user3);

        expect(res3.statusCode).to.equal(400);
    });

    it('sign up with existed email', async () => {
        const user = {
            name: users[0].name,
            email: users[0].email,
            password: 'password'
        };

        const res = await requester
            .post('/api/1.0/user/signup')
            .send(user);

        expect(res.body.error).to.equal('This Email Already Exists');
    });

    it('sign up with malicious email', async () => {
        const user = {
            name: users[0].name,
            email: '<script>alert(1)</script>',
            password: 'password'
        };

        const res = await requester
            .post('/api/1.0/user/signup')
            .send(user);

        expect(res.body.error).to.equal('Request Error: Invalid email format');
    });

    /**
     * Native Sign In
     */

    it('native sign in with correct password', async () => {
        const user1 = users[0];
        const user = {
            provider: user1.provider,
            email: user1.email,
            password: user1.password
        };

        const res = await requester
            .post('/api/1.0/user/signin')
            .send(user);

        const data = res.body.data;
        const userExpect = {
            id: data.user.id,
            provider: user1.provider,
            name: user1.name,
            email: user1.email,
            picture: null
        };

        expect(data.user).to.deep.equal(userExpect);
        expect(data.access_token).to.be.a("string")
        expect(data.access_expired).to.equal(expectedExpireTime);

        const loginTime = await pool.query(
            'SELECT login_at FROM user WHERE email = ?',
            [user.email]
        );

        expect(new Date(data.login_at).getTime()).to.closeTo(Date.now(), 1000);
        expect(new Date(loginTime[0][0].login_at).getTime()).to.closeTo(Date.now(), 1000);
    });

    it('native sign in without provider', async () => {
        const user1 = users[0];
        const user = {
            email: user1.email,
            password: user1.password
        };

        const res = await requester
            .post('/api/1.0/user/signin')
            .send(user);

        expect(res.body.error).to.equal('Wrong Request');
    });

    it('native sign in without email or password', async () => {
        const user1 = users[0];
        const userNoEmail = {
            provider: user1.provider,
            password: user1.password
        };

        const res1 = await requester
            .post('/api/1.0/user/signin')
            .send(userNoEmail);

        expect(res1.status).to.equal(400);
        expect(res1.body.error).to.equal('Request Error: email and password are required.');

        const userNoPassword = {
            provider: user1.provider,
            email: user1.email,
        };

        const res2 = await requester
            .post('/api/1.0/user/signin')
            .send(userNoPassword);

        expect(res2.status).to.equal(400);
        expect(res2.body.error).to.equal('Request Error: email and password are required.');
    });

    it('native sign in with wrong password', async () => {
        const user1 = users[0];
        const user = {
            provider: user1.provider,
            email: user1.email,
            password: 'wrong password'
        };

        const res = await requester
            .post('/api/1.0/user/signin')
            .send(user);

        expect(res.status).to.equal(403);
        expect(res.body.error).to.equal('Wrong Password!');
    });

    it('native sign in with malicious password', async () => {
        const user1 = users[0];
        const user = {
            provider: user1.provider,
            email: user1.email,
            password: '" OR 1=1; -- '
        };

        const res = await requester
            .post('/api/1.0/user/signin')
            .send(user);

        expect(res.status).to.equal(403);
        expect(res.body.error).to.equal('Wrong Password!');
    });

});