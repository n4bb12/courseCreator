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
const Chapter = require('../models/chapterSchema');


chai.use(chaiHttp);

describe('Course', () => {
    beforeEach((done) => { // Before each test we empty the database
        Chapter.remove({}, (err) => { 
           done();           
        });        
    });
/*
  * Test the /GET route
  */
  describe('/POST Course', () => {
      it('it should get all the chapters', (done) => {
        
        const chapterBody = {
          email:'arnab.sadhya@gmail.com',
          courseId: "2sda81a"
        };

        chai.request(server)
            .post('/chapter/fetchchapters')
            .send(chapterBody)
            .end((err, res) => {
                  console.log(res.body);
                  res.should.have.status(200);
                  //res.body.should.be.a('array');
                  //res.body.length.should.be.eql(0);
              done();
            });
      });
  });


  describe('/chapter/addchapter', () => {
    it('it should not creare a chapter without chapte title field', (done) => {
        const chaperData = {
            courseId: "213da91xa",
            chapterOrder: 1,
            chapterId: "31xad2xac"
       };

      chai.request(server)
          .post('/chapter/addchapter')
          .send(chaperData)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                // res.body.should.have.property('errors');
                // res.body.errors.should.have.property('pages');
                // res.body.errors.pages.should.have.property('kind').eql('required');
            done();
          });
    });

});

});