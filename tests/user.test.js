"use strict";

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let faker = require('faker');
let should = chai.should();

chai.use(chaiHttp);

let fakeUser = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    token: ""
};

describe('### User Test Suite', () => {
    /** Test the POST /api/users route  */
    describe('# POST /api/users', () => {
        it('returns an object containing an id, name, email and token', (done) => {
            chai.request(app)
                .post('/api/users')
                .send(fakeUser)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an('object');
                    res.body.user._id.should.be.a('string');
                    res.body.user.name.should.be.a('string');
                    res.body.user.email.should.be.a('string');
                    res.body.token.should.be.a('string');
                    should.not.exist(res.body.password); // don't return a password in the response
                    should.not.exist(res.body.user.password);
                    done();
                });
        });
        it('returns an error if missing required fields', (done) => {
            chai.request(app)
                .post('/api/users')
                .send({
                    email: fakeUser.email,
                    password: fakeUser.password
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an('object');
                    res.body.error[0].msg.should.equal('Invalid name');
                    done();
                });
        });
        it('returns an error if not a valid email', (done) => {
            chai.request(app)
                .post('/api/users')
                .send({
                    name: "dave",
                    email: "invalid.me",
                    password: fakeUser.password
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an('object');
                    res.body.error[0].msg.should.equal('Invalid email address');
                    done();
                });
        });
        it('returns an error if email already exists', (done) => {
            chai.request(app)
            .post('/api/users')
            .send({
                name: "dave",
                email: fakeUser.email,
                password: fakeUser.password
            }).end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.an('object');
                res.body.error.should.equal('Email already exists');
                done();
            });
        });
        it('creates admin user if correct secret provided', (done) => {
            chai.request(app)
            .post('/api/users')
            .send({
                name: faker.name.findName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                secret: process.env.TEST_SECRET
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.an('object');
                res.body.user._id.should.be.a('string');
                res.body.user.name.should.be.a('string');
                res.body.user.email.should.be.a('string');
                res.body.user.role.should.equal('admin');
                res.body.token.should.be.a('string');
                should.not.exist(res.body.password); // don't return a password in the response
                should.not.exist(res.body.user.password);
                done();
            })
        })
        it('returns an error if secret incorrect', (done) => {
            chai.request(app)
            .post('/api/users')
            .send({
                name: faker.name.findName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                secret: "incorrectsecret"
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.an('object');
                res.body.error.should.equal('Incorrect secret');
                done();
            })
        })

    });

    /** Test the POST /api/users/login route  */
    describe('# POST /api/users/login', () => {
        it('returns an object containing an id, name, email and token', (done) => {
            chai.request(app)
                .post('/api/users/login')
                .send({
                    email: fakeUser.email,
                    password: fakeUser.password
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.user._id.should.be.a('string');
                    res.body.user.name.should.be.a('string');
                    res.body.user.email.should.be.a('string');
                    res.body.token.should.be.a('string');
                    should.not.exist(res.body.password); // don't return a password in the response
                    should.not.exist(res.body.user.password);
                    done();
                });
        });
        it('returns an error if missing required fields', (done) => {
            chai.request(app)
                .post('/api/users/login')
                .send({
                    email: fakeUser.email
                })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    done();
                });
        });
        it('returns an error if email incorrect', (done) => {
            chai.request(app)
                .post('/api/users/login')
                .send({
                    email: "madethisup@email.com",
                    password: fakeUser.password
                })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    res.body.error.should.be.a('string');
                    res.body.error.should.equal('Login failed! Check authentication credentials');
                    done();
                });
        });
        it('returns an error if password incorrect', (done) => {
            chai.request(app)
                .post('/api/users/login')
                .send({
                    email: fakeUser.email,
                    password: "not-a-real-password"
                })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    res.body.error.should.be.a('string');
                    res.body.error.should.equal('Login failed! Check authentication credentials');
                    done();
                });
        });
    });

    /** Test the GET /api/users/me route  */
    describe('# GET /api/users/me', () => {
        it('returns an object containing an id, name and email', (done) => {
            chai.request(app)
                .post('/api/users/login')
                .send(fakeUser)
                .end((err, res) => {
                    return chai.request(app)
                        .get('/api/users/me')
                        .set('Authorization', 'Bearer ' + res.body.token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.an('object');
                            res.body.user._id.should.be.a('string');
                            res.body.user.name.should.be.a('string');
                            res.body.user.email.should.be.a('string');
                            should.not.exist(res.body.password); // don't return a password in the response
                            should.not.exist(res.body.user.password);
                            should.not.exist(res.body.tokens); // don't return all tokens in the response
                            should.not.exist(res.body.user.tokens);
                        })
                })
            done();
        });
        it('returns an error if no auth token', (done) => {
            chai.request(app)
                .get('/api/users/me')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    res.body.error.should.be.a('string');
                    res.body.error.should.equal('Not authorized to access this resource');
                    done();
                });
        });
        it('returns an error if missing required fields', (done) => {
            chai.request(app)
                .get('/api/users/me').end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    done();
                });
        });
    });

    /** Test the POST /api/users/me/logout route  */
    describe('# POST /api/users/me/logout', () => {
        it('returns an object confirming logout', (done) => {
            chai.request(app)
                .post('/api/users/') // register as new user first
                .send({ // create a new fake user
                    name: faker.name.findName(),
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                })
                .end((err, res) => {
                    return chai.request(app) // then logout
                        .post('/api/users/me/logout')
                        .set('Authorization', 'Bearer ' + res.body.token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.an('object');
                            res.body.loggedOut.should.be.a('boolean');
                            res.body.loggedOut.should.be.true;
                            done();
                        })
                })
        });
        it('returns an error if no auth token', (done) => {
            chai.request(app)
                .post('/api/users/me/logout')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    res.body.error.should.be.a('string');
                    res.body.error.should.equal('Not authorized to access this resource');
                    done();
                });
        });
    });

    /** Test the POST /api/users/me/logoutall route */
    describe('# POST /api/users/me/logoutall', () => {
        it('returns an object confirming logout', (done) => {
            chai.request(app) // register as new user first
                .post('/api/users/')
                .send({ // create a new fake user
                    name: faker.name.findName(),
                    email: faker.internet.email(),
                    password: faker.internet.password(),
               })
                .end((err, res) => {
                    return chai.request(app)
                        .post('/api/users/me/logout') // then logout
                        .set('Authorization', 'Bearer ' + res.body.token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.an('object');
                            res.body.loggedOut.should.be.a('boolean');
                            res.body.loggedOut.should.be.true;
                            done();
                        })
                })
        });
        it('returns an error if no auth token', (done) => {
            chai.request(app)
                .post('/api/users/me/logoutall')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    res.body.error.should.be.a('string');
                    res.body.error.should.equal('Not authorized to access this resource');
                    done();
                });
        });
    });
});