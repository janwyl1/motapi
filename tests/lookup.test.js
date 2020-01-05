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
        it('returns an error if missing reg', (done) => { // Shows a generic 404 page because route api/lookup doesnt exist, only /api/lookup/:reg does
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
            .get('/api/lookup/' + '1')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.an('object'); 
                res.body.errors.should.be.an('array');
                res.body.errors[0].value.should.equal('1');
                res.body.errors[0].msg.should.equal('Invalid Vehicle Registration')
                done();
            })
        });      
        it('returns an error if no vehicle found', (done) => {
            chai.request(app)
            .get('/api/lookup/' + 'mt55wer')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.an('object');   
                res.body.httpStatus.should.equal("404")
                res.body.errorMessage.should.equal("No MOT Tests found with vehicle registration : mt55wer")
                done();
            })
        });      
    });
});
