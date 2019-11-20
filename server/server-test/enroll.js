/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");

// Require the dev-dependencies

const chai = require('chai');

const chaiHttp = require('chai-http');

const should = chai.should();

const server = require('../server');
const Enroll = require('../models/course-enroll.model');


chai.use(chaiHttp);

describe('Course', () => {
    beforeEach((done) => { // Before each test we empty the database
        Enroll.remove({}, (err) => { 
           done();           
        });        
    });
/*
  * Test the /GET route
  */
  describe('/POST Course', () => {
      it('it should get all the course', (done) => {
        chai.request(server)
            .post('/enroll/fetchenrollcourses')
            .end((err, res) => {
                  console.log(res.body);
                  res.should.have.status(200);
                  //res.body.should.be.a('array');
                  //res.body.length.should.be.eql(0);
              done();
            });
      });
  });


  describe('/enroll/enrollcourse', () => {
    it('it should not creare a course without course id field', (done) => {
        const enrollModel = {
            coursePrice: 10,
            courseDuration: "8hrs",
            name: "Arnab"
       };

      chai.request(server)
          .post('/course/create')
          .send(enrollModel)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                // res.body.errors.should.have.property('pages');
                // res.body.errors.pages.should.have.property('kind').eql('required');
            done();
          });
    });

});

});