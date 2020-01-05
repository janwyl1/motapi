"use strict";

/** Set env variable to test */
process.env.NODE_ENV = 'test';

/** Require the dev-dependencies */
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();
let faker = require('faker');
chai.use(chaiHttp);

/** Helper functions */ 
const genUser = () => {
    return {
            name: faker.name.findName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            token: ""
    }
}
const genAppt = () => {
    return {
        apptDate: "2019-11-01T22:34:50.138+00:00",
        customer: {
            name: "james",
            email: "james@email.com",
            phone: "07444555666",
            altPhone: "01514569872"
        },
        car: {
            registration: "MD56AHR",
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
    }
}

/** Test suite */ 
describe('### Appointment Test Suite', () => {
    /** Create dummy data objects */
    const fakeAppt = genAppt();
    const fakeUser = genUser();
    const fakeAdmin = genUser();
    fakeAdmin.secret = process.env.TEST_SECRET
    
    /** Create basic user */ 
    before(done => {
        chai.request(app)
            .post('/api/users')
            .send(fakeUser)
            .end((err, res) => {
                fakeUser.token = res.body.token;
                done()
            });
    })
    /** Create admin user */ 
    before(done => {
        chai.request(app)
        .post('/api/users')
        .send(fakeAdmin)
        .end((err, res) => {
            fakeAdmin.token = res.body.token;
            done();
        })
    })

    /* Test the create new appointment route */
    describe('# POST /api/appts', () => {
        it('returns an appointment object', (done) => {
            chai.request(app)
                .post('/api/appts')
                .set('Authorization', 'Bearer ' + fakeUser.token)
                .send(fakeAppt)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.created._id.should.have.lengthOf(24);
                    res.body.created.customer.name.should.equal(fakeAppt.customer.name)
                    res.body.created.car.registration.should.equal(fakeAppt.car.registration)
                    res.body.created.user.should.have.lengthOf(24);
                    done();
                });
        });
        it('returns an error if missing required fields', (done) => {
            chai.request(app)
                .post('/api/appts')
                .set('Authorization', 'Bearer ' + fakeUser.token)
                .send({
                    apptDate: fakeAppt.apptDate
                })
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.be.an('object');
                    done();
                });
        })
    });

    /* Test the View all appointments route */
    describe('# GET /api/appts', () => {
        it('returns an array of appointment objects', (done) => {
            chai.request(app)
                .get('/api/appts')
                .set('Authorization', 'Bearer ' + fakeAdmin.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    res.body[0].should.be.an('object');
                    res.body[0].customer.name.should.be.a('string');
                    res.body[0].customer.email.should.be.a('string');
                    res.body[0].customer.phone.should.be.a('string');
                    res.body[0].car.registration.should.be.a('string');
                    done();
                });
        });
        it('returns an error if no auth token', (done) => {
            chai.request(app)
                .get('/api/appts/')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    res.body.error.should.equal('Not authorized to access this resource');
                    done();
                });
        })
    });

    /* Test the View Single appointment route */
    describe('# GET /api/appts/:id', () => {
        /** Create an apointment */ 
        before(done => {
            chai.request(app)
                .post('/api/appts')
                .set('Authorization', 'Bearer ' + fakeUser.token)
                .send(fakeAppt)
                .end((err, res) => {
                    fakeAppt.id = res.body.created._id; // save the appointment id of newly created appointment 
                    done()
                });
        })
        it('returns an appointment object', (done) => {
            chai.request(app)
                .get('/api/appts/' + fakeAppt.id)
                .set('Authorization', 'Bearer ' + fakeUser.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.customer.name.should.be.a('string');
                    res.body.customer.email.should.be.a('string');
                    res.body.customer.phone.should.be.a('string');
                    res.body.car.registration.should.be.a('string');
                    res.body._id.should.equal(fakeAppt.id);
                    res.body._id.should.have.lengthOf(24);
                    done();
                });
        });
        it('returns an error if appt object can\'t be found by id', (done) => {
            chai.request(app)
                .get('/api/appts/' + '5dbd9d4a87ea9330909fc416')
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

    /* Test the update appointment route */
    describe('# UPDATE /api/appts/:id', () => {
        const dummyUpdate = {
            apptDate: "2019-11-01T22:34:50.138Z",
            customer: {
                name: "THIS WAS UPDATED",
                email: "updated@email.com",
                phone: "075656498956"
            },
            car: {
                registration: "YY69ETR",
                make: "RENAULT",
                model: "CLIO",
                fuelType: "Diesel",
                engineSize: 3600
            }
        }
        it('returns an appointment object', (done) => {
            chai.request(app)
                .get('/api/appts/')
                .set('Authorization', 'Bearer ' + fakeAdmin.token)
                .end((err, res) => {
                    chai.request(app)
                        .put('/api/appts/' + res.body[0]._id)
                        .set('Authorization', 'Bearer ' + fakeUser.token)
                        .send(dummyUpdate)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.an('object');
                            res.body.updated.should.be.a('string');
                            res.body.updated.should.have.lengthOf(24);;
                            done();
                        });
                })
        });
        it('returns an error if no appointment exists', (done) => {
            chai.request(app)
                .put('/api/appts/5dc4a954d2c31904e8de652c')
                .set('Authorization', 'Bearer ' + fakeUser.token)
                .send(dummyUpdate)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an('object');
                    res.body.error.should.match(/^No appointment found with id/);
                    done();
                });
        })
    });

    /* Test the delete appointment route */
    describe('# DELETE /api/appts/:id', () => {
        it('returns an appointment object', (done) => {
            chai.request(app)
                .post('/api/appts')
                .set('Authorization', 'Bearer ' + fakeUser.token)
                .send(fakeAppt)
                .end((err, res) => {                  
                    chai.request(app)
                        .delete('/api/appts/' + res.body.created._id)
                        .set('Authorization', 'Bearer ' + fakeUser.token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.an('object');
                            res.body.deleted.should.be.an('object')
                            res.body.deleted.customer.name.should.equal(fakeAppt.customer.name)
                            res.body.deleted.car.registration.should.equal(fakeAppt.car.registration)
                            done();
                        });
                })
        });
        it('returns an error if no appointment exists', (done) => {
            chai.request(app)
                .delete('/api/appts/5dc4a954d2c31904e8de652c')
                .set('Authorization', 'Bearer ' + fakeUser.token)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an('object');
                    res.body.error.should.match(/^No appointment found with id/);
                    done();
                });
        })
    });

});