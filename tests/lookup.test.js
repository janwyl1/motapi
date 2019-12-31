"use strict";

/** Set env variable to test */
process.env.NODE_ENV = 'test';

/** Require the dev-dependencies */
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();
chai.use(chaiHttp);
/** Test suite */ 
describe('### Lookup External API Test Suite', () => {
    const dummyCar = {
        reg: "MT55WHR",
        make: "FORD",
        model: "FIESTA"
    }
    /* Test the fetch MOT data route */
    describe('# GET /api/lookup/:reg', () => {
        it('returns an MOT history object', (done) => {
            chai.request(app)
                .get('/api/lookup/' + dummyCar.reg)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');   
                    res.body[0].registration.should.equal(dummyCar.reg)
                    res.body[0].make.should.equal(dummyCar.make)
                    res.body[0].model.should.equal(dummyCar.model)
                    done();
                       
                })
        });
    });
    describe('#GET /api/lookup/', () => {
        // Shows a generic 404 page because route api/lookup doesnt exist, only /api/lookup/:reg does
        it('returns an error if missing reg', (done) => {
            chai.request(app)
            .get('/api/lookup/')
            .end((err, res) => {
                res.should.have.status(404); 
                res.body.should.be.an('object');    
                done();
            })
        });
        it('returns an error if invalid reg', (done) => {
            chai.request(app)
            .get('/api/lookup/' + 'm1234')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.an('object');   
                res.body.httpStatus.should.equal("404")
                res.body.errorMessage.should.equal("No MOT Tests found with vehicle registration : m1234")
                done();
            })
        });      
    });
});
