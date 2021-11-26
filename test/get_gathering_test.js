
const { expect } = require('chai');
const supertest = require('supertest');

// const api = supertest('http://localhost:3000/api/1.0/getgatherings/all');
const api = supertest('http://localhost:3000/api/1.0');

let accessToken;

// before((done) => {
//     api.post('/user/signin')
//         .set('Accept', 'application/json')
//         .send({
//             email: 'test@test.com',
//             password: '123'
//         })
//         .expect(200)
//         .end((err, res) => {
//             accessToken = res.body.data.access_token;
//             done();
//         })

// })


describe('Gathering', () => {
    it('Gathering should be an object with keys and values', (done) => {
        api.get('/getgatherings/all?Hbg=121.44782593124997&Hbi=121.57966186874997&tcg=25.01230243511096&tci=25.08110251346366')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                // console.log('res.data[0]', res.body.data[0])
                expect(res.body.data[0]).to.have.property('id');
                done();






            })

    });

});
