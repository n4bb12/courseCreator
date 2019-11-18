const mongoose = require('mongoose');
const courseModel = require('../models/courseSchema');
const chapterModel = require('../models/chapterSchema');
const contentModel = require('../models/contentSchema');
const courseObject = {};

courseObject.courseCreate = async (req, res) => {
    console.log(req.body);
    try{
        var course = new courseModel({
            courseId: req.body.courseId,
            email: req.body.email,
            courseName: req.body.courseName,
            courseSubtitle: req.body.courseSubtitle,
            courseDesc: req.body.courseDesc,
            coursePrice: req.body.coursePrice,
            courseDuration: req.body.courseDuration  
        });
    
        const response = await course.save();
        if(response){
            res.send({
                status: 200,
                response
            })
        }
        else{
            res.send({
                status: 500,
                error: response
            })
        }
    }
    catch(e){
        res.send(e);
    }
   
}

courseObject.courseUpdate = async(req, res) => {
    try{
        const query = { courseId: req.body.courseId };
        console.log(query);
        console.log(req.body);
        courseModel.findOneAndUpdate(query, req.body, (err, data) => {
            if(err) return res.send(500, {err})
            return res.send({data,status:200});
        })
    }
    catch(e){
        res.send(e);
    }
}

courseObject.fetchCourses = async(req, res) => {
    try{

       const query = { email: req.query.email};
       console.log(req.query);

       courseModel.find(query, (error, response) => {
           if(error) res.send({status: 500, error})
           res.send({status: 200, response})
       })
    }
    catch(e){

    }
}


courseObject.fetchChapters = async(req, res) => {
    try{

       const query = { email: req.body.email, courseId: req.body.courseId};
       console.log(query);

       chapterModel.find(query, {}, {sort: {chapterOrder: 1}},(error, response) => {
           if(error) res.send({status: 500, error}) 
           res.send({status: 200, response})
       })
    }
    catch(e){
        res.send(e);
    }
}


courseObject.addChapter = async(req, res)=> {
    try{
        var chapter = new chapterModel({
            courseId: req.body.courseId,
            chapterTitle:req.body.chapterTitle,
            chapterId: req.body.chapterId,
            chapterOrder: req.body.chapterOrder,
            email: req.body.email
        });
    
        const response = await chapter.save();
        if(response){
            res.send({
                status: 200,
                response
            })
        }
        else{
            res.send({
                status: 500,
                error: response
            })
        }
    }
    catch(e){
        res.send(e);
    }
   
}


courseObject.addContent = async(req, res)=> {
    try{
        var content = new contentModel({
            courseId: req.body.courseId,
            chapterId: req.body.chapterId,
            contentTitle:req.body.contentTitle,
            contentOrder: req.body.contentOrder,
            email: req.body.email,
            contentType: req.body.contentType,
            content: req.body.content ? req.body.content : ''
        });


        const response = await content.save();
        if(response){
            res.send({
                status: 200,
                response
            })
        }
        else{
            res.send({
                status: 500,
                error: response
            })
        }
    }
    catch(e){
        res.send(e);
    }
   
}

module.exports = courseObject;