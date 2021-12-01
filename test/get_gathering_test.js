
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
                expect(res.body.data[0]).to.have.property('title');
                expect(res.body.data[0]).to.have.property('description');
                expect(res.body.data[0]).to.have.property('category');
                expect(res.body.data[0]).to.have.property('picture');
                expect(res.body.data[0]).to.have.property('host_id');
                expect(res.body.data[0]).to.have.property('start_at');
                expect(res.body.data[0]).to.have.property('created_at');
                expect(res.body.data[0]).to.have.property('max_participant');
                expect(res.body.data[0]).to.have.property('remaining_quota');
                expect(res.body.data[0]).to.have.property('place');
                expect(res.body.data[0]).to.have.property('lng');
                expect(res.body.data[0]).to.have.property('lat');
                expect(res.body.data[0]).to.have.property('email');
                expect(res.body.data[0]).to.have.property('name');
                expect(res.body.data[0]).to.have.property('host_pic');
                expect(res.body.data[0]).to.have.property('popularity');
                expect(res.body.data[0]).to.have.property('rating');
                done();






            })

    });

});
