const mongoose = require('mongoose');
const CourseModel = require('../models/courseSchema');
const ChapterModel = require('../models/chapterSchema');
const ContentModel = require('../models/contentSchema');
const FilesModel = require('../models/fs.files.model');
const EnrollModel = require('../models/course-enroll.model');


const courseObject = {};

courseObject.courseCreate = async (req, res) => {
    console.log(req.body);
    try{
        const course = new CourseModel({
            courseId: req.body.courseId,
            email: req.body.email,
            courseName: req.body.courseName,
            courseSubtitle: req.body.courseSubtitle,
            courseDesc: req.body.courseDesc,
            coursePrice: req.body.coursePrice,
            courseDuration: req.body.courseDuration  
        });
    
        const response = await course.save();
        console.log(response);
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


courseObject.enrollCourse = async (req, res) => {
    console.log(req.body);
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
        console.log(response);
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

courseObject.fetchEnrollCourses = async (req, res) => {

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

courseObject.courseUpdate = async(req, res) => {
    try{
        const query = { courseId: req.body.courseId };
        console.log(query);
        console.log(req.body);
        CourseModel.findOneAndUpdate(query, req.body, (err, data) => {
            if(err) return res.send(500, {err});
            return res.send({data,status:200});
        });
    }
    catch(e){
        res.send(e);
    }
};

courseObject.updatecontent = async(req, res) =>{
    console.log(req.body);
    try{
        const query = { contentId: req.body.contentId };
        ContentModel.findOneAndUpdate(query, req.body, (err, data) => {
            if(err) return res.send(500, {err});
            return res.send({data,status:200});
        });
    }
    catch(e){
        res.send(e);
    }
};

courseObject.fetchCourses = async(req, res) => {
    try{
        let query = null;

       if(req.query.view === 'admin')
       {
        query = { email: req.query.email};
        CourseModel.find(query, (error, response) => {
            if(error) res.send({status: 500, error});
            res.send({status: 200, response});
        });
       }
       else if(req.query.view === 'public'){
        CourseModel.find({}, (error, response) => {
            if(error) res.send({status: 500, error});
            res.send({status: 200, response});
        });
       }
       else{
        query = { courseId: req.query.courseId};
        CourseModel.find(query, (error, response) => {
            if(error) res.send({status: 500, error});
            else{
                res.send({response});
              /*   const query = {courseId: response.data.response.courseId};
                ChapterModel.find(query, {}, {sort: {chapterOrder: 1}},(error, response) => {
                    if(error) res.send({status: 500, error}); 
                    res.send({status: 200, response});
                }); */
            }
        });
       }
       console.log(req.query);

    
    }
    catch(e){
        res.send(e);
    }
};


courseObject.fetchChapters = async(req, res) => {
    try{
       console.log(req.body);
       const query = {courseId: req.body.courseId};
       console.log(query);

       ChapterModel.find(query, {}, {sort: {chapterOrder: 1}},(error, response) => {
           if(error) res.send({status: 500, error}); 
           res.send({status: 200, response});
       });
    }
    catch(e){
        res.send(e);
    }
};


courseObject.addChapter = async(req, res)=> {
    try{
        const chapter = new ChapterModel({
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


courseObject.updateChapter = async(req, res) =>{
    try{
        const query = { chapterId: req.body.chapterId };
        console.log(req.body);
        console.log('query', query);
        ChapterModel.findOneAndUpdate(query, req.body, (err, data) => {
            if(err) return res.send(500, {err});
            return res.send({data,status:200});
        });
    }
    catch(e){
        res.send(e);
    }
};


courseObject.addContent = async(req, res)=> {
    try{
        console.log(req);
        const content = new ContentModel({
            courseId: req.body.courseId,
            chapterId: req.body.chapterId,
            contentId:req.body.contentId,
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

courseObject.getallmediacontent = async(req, res) => {

    FilesModel.find(
        { metadata: { parentRecordID: req.body.contentId } },
        (err, doc) => {
          if (!doc || doc.length === 0) {
            return res.status(500).json({
              err: 'No available files'
            });
          }
          // File exists
          return res.status(200).send(doc);
        }
      );
};

courseObject.getContent = async (req, res) => {
    try{

        const query = { chapterId: req.body.chapterId}; 
        console.log(query);
        ContentModel.find(query, {}, {sort: {contentOrder: 1, contentTitle: 1}},(error, response) => {
            if(error){
                res.send({status: 500, error});
            }
            else{
                console.log(response.data);
                res.send({status: 200, response});
            } 
        });
     }
     catch(e){
         res.send(e);
     }
};

module.exports = courseObject;