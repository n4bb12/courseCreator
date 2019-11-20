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
const Course = require('../models/courseSchema');


chai.use(chaiHttp);

describe('Course', () => {
    beforeEach((done) => { // Before each test we empty the database
        Course.remove({}, (err) => { 
           done();           
        });        
    });
/*
  * Test the /GET route
  */
  describe('/GET Course', () => {
      it('it should GET all the course', (done) => {
        chai.request(server)
            .get('/course/')
            .end((err, res) => {
                  console.log(res.body);
                  res.should.have.status(200);
                  // res.body.should.be.a('array');
                  // res.body.length.should.be.eql(0);
              done();
            });
      });
  });


  describe('/POST course', () => {
    it('it should not creare a course without name field', (done) => {
        const course = {
          courseId: "k35qbbrx",
          email: "arnab.sadhya@gmail.com",
          courseSubtitle: "sadsad",
          courseDesc: "sadasd",
          coursePrice: 33.00,
          courseDuration: 9.1,
          status: "draft"
       };

      chai.request(server)
          .post('/course/create')
          .send(course)
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