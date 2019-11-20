const EnrollModel = require('../models/course-enroll.model');

const enrollObject = Object.create({});


// API to invoke when user enrolls to a course

enrollObject.enrollCourse = async (req, res) => {
    try{
        const course = new EnrollModel({
            courseId: req.body.courseId,
            email: req.body.email,
            name: req.body.name,
            courseName: req.body.courseName,
            coursePrice: req.body.coursePrice,
            courseDuration: req.body.courseDuration  
        });
    
        const response = await course.save();
        if(response){
            res.send({
                status: 200,
                response
            });
        }
        else{
            res.send({
                status: 500,
                error: response
            });
        }
    }
    catch(e){
        res.send(e);
    }
};

enrollObject.fetchEnrollCourses = async (req, res) => {

   try{
       const query = {email: req.body.email};
       EnrollModel.find(query,(error, response) => {
           if(error) res.send({status: 500, error}); 
           res.send({status: 200, response});
       });
    }
    catch(e){
        res.send(e);
    }
};

module.exports = enrollObject;