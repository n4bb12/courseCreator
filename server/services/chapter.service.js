const ChapterModel = require('../models/chapterSchema');

const ChapterObject = {};

ChapterObject.fetchChapters = async(req, res) => {
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


ChapterObject.addChapter = async(req, res)=> {
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


ChapterObject.updateChapter = async(req, res) =>{
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

module.exports = ChapterObject;