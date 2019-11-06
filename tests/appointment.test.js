"use strict";

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();
let faker = require('faker');


chai.use(chaiHttp);

describe('### Appointment Test Suite', () => {
    let fakeUser = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        token: ""
    };
    let apptId = "";

    before((done) => {
        chai.request(app)
            .post('/api/users')
            .send(fakeUser)
            .end((err, res) => {
                fakeUser.token = res.body.token;
                done();
            })
    })
    /* Test the POST /api/appt/new route  */
    describe('# POST /api/appt/new', () => {
        it('it should return an object containing an appointment ID', (done) => {
            chai.request(app)
                .post('/api/appt/new')
                .send({
                    apptDate: "2019-11-01T22:34:50.138+00:00",
                    apptTime: "2019-11-01T22:34:50.138+00:00",
                    customer: {
                        name: "james",
                        email: "james@email.com",
                        mobile: "07444555666",
                        altPhone: "01514569872"
                    },
                    car: {
                        registration: "MT55WHR",
                        make: "FORD",
                        model: "FOCUS",
                        firstUsed: "",
                        fuelType: "Petrol",
                        color: "Yellow",
                        vehicleId: "4tq319nvklz+25irauo79w==",
                        regDate: "2010-11-13T00:00:00.000+00:00",
                        manufacDate: "2010-11-13T00:00:00.000+00:00",
                        engineSize: 1800
                    }
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.appt.should.have.lengthOf(24);

                    apptId = res.body.appt; // set id for testing other routes
                    done();
                });
        });

        it('it should return an error if missing required fields', (done) => {
            chai.request(app)
                .post('/api/appt/new')
                .send({
                    apptDate: "2019-11-01T22:34:50.138+00:00",
                    apptTime: "2019-11-01T22:34:50.138+00:00"
                })
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.be.an('object');
                    // res.body.error.should.be.a('string');
                    done();
                });
        })
    });

    /* Test the GET /api/appt route  */
    describe('# GET /api/appt', () => {
        it('it should return an array of appointment objects', (done) => {
            chai.request(app)
                .get('/api/appt/')
                .set('Authorization', 'Bearer ' + fakeUser.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    res.body[0].should.be.an('object');
                    res.body[0].customer.name.should.be.a('string');
                    res.body[0].customer.email.should.be.a('string');
                    res.body[0].customer.mobile.should.be.a('string');
                    res.body[0].car.registration.should.be.a('string');
                    res.body[0].car.vehicleId.should.have.lengthOf(24);
                    done();
                });
        });
        it('it should error if no auth token', (done) => {
             chai.request(app)
            .get('/api/appt/')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.an('object');
                res.body.error.should.equal('Not authorized to access this resource');
                done();
            });
        })
    });

    /* Test the GET /api/appt/:id route  */
    describe('# GET /api/appt/:id', () => {
        it('it should return an appointment object', (done) => {
            chai.request(app)
                .get('/api/appt/' + apptId)
                .set('Authorization', 'Bearer ' + fakeUser.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    res.body[0].should.be.an('object');
                    res.body[0].customer.name.should.be.a('string');
                    res.body[0].customer.email.should.be.a('string');
                    res.body[0].customer.mobile.should.be.a('string');
                    res.body[0].car.registration.should.be.a('string');
                    res.body[0]._id.should.equal(apptId);
                    res.body[0]._id.should.have.lengthOf(24);
                    done();
                });
        });
        it('it should error if appt object can\'t be found by id', (done) => {
            chai.request(app)
                .get('/api/appt/' + '5dbd9d4a87ea9330909fc416')
                .set('Authorization', 'Bearer ' + fakeUser.token)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an('object');
                    res.body.error.should.be.a('string');
                    res.body.error.should.include('No appointment found');
                    done();
                });
        })
    });

    /* Test the UPDATE /api/appt/:id route  */
    describe('# UPDATE /api/appt/:id', () => {
        it('it should return an appointment object', (done) => {
            chai.request(app)
                .get('/api/appt/')
                .set('Authorization', 'Bearer ' + fakeUser.token)
                .end((err, res) => {
                    chai.request(app)
                        .put('/api/appt/' + res.body[0]._id)
                        .set('Authorization', 'Bearer ' + fakeUser.token)
                        .send({
                            customer: {
                                name: "THIS WAS UPDATED",
                                email: "updated@email.com",
                                mobile: "075656498956"
                            },
                            car: {
                                registration: "YY694TR",
                                make: "RENAULT",
                                model: "CLIO",
                                fuelType: "Diesel",
                                engineSize: 3600
                            }
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.an('object');
                            done();
                        });
                })
        });
    });

    /* Test the DELETE /api/appt/:id route  */
    describe('# DELETE /api/appt/:id', () => {
        it('it should return an appointment object', (done) => {
            chai.request(app)
                .get('/api/appt/')
                .set('Authorization', 'Bearer ' + fakeUser.token)
                .end((err, res) => {
                    chai.request(app)
                        .delete('/api/appt/' + res.body[0]._id)
                        .set('Authorization', 'Bearer ' + fakeUser.token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.an('object');
                            done();
                        });
                })

        });
    });
});