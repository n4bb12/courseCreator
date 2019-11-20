/* eslint-disable consistent-return */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const courseService = require('../services/courseCreate');

let db;
let GFS;
let connectionURL = null;
let filestorage;

mongoose.connection.once('open',async () => {
    db = mongoose.connection.db;
    // console.log(db);
    connectionURL = mongoose.connection.client.s.url;      
    console.log(`final url${  connectionURL}`);
    GFS = Grid(db, mongoose.mongo);
    GFS.collection('fileuploads');

});



// storage configuration
filestorage = new GridFsStorage({
    url: 'mongodb://localhost:27017/coursecreator',
    file: (req, file) => {
    console.log(`connection url${ connectionURL}`);
    console.log(req.query);
    return {
        filename: file.originalname,
        bucketName: 'fileuploads',
        metadata: {
        parentRecordID: req.query.contentId
        }
    };
    }
});

  // multer configuration
  const upload = multer({
    storage: filestorage,
    limits: {
      fileSize: 40000000
    },
    fileFilter(req, file, cb) {
    console.log(file);
    console.log('file details');    
      if (!file.originalname.match(/\.(doc|docx|pdf|PDF|jpg|png|jpeg|zip|ppt|pptx|rar|gz|mp4|mpg|flv)$/)) {
        cb(new Error('File Not Supported'));
      }
      cb(undefined, true);
    }
  });

router.post('/create', (req, res) => {
    courseService.courseCreate(req, res);
});

router.put('/update', (req, res) => {
    courseService.courseUpdate(req, res);
});

router.get('/', (req, res) => {
   courseService.fetchCourses(req, res);
});

router.post('/fetchchapters', (req, res) => {
    courseService.fetchChapters(req, res);
 });
 
router.post('/addchapter', (req, res) => {
    courseService.addChapter(req, res);
});

router.put('/updatechapter', (req, res) => {
    courseService.updateChapter(req, res);
});
//end chapter

//content start
router.post('/addContent', (req, res) => {
    courseService.addContent(req, res);
});

router.post('/getcontent', (req, res) => {
  courseService.getContent(req, res);
});

router.put('/updatecontent', (req, res) => {
  courseService.updatecontent(req, res);
});

router.post('/getallmediacontent', (req, res) => {
  courseService.getallmediacontent(req, res);
});

router.post('/upload', upload.array('files'), (req, res) => {
   /*  console.log(req);
    console.log(res); */
    res.json('Successfully uploaded the file');
  },
  (error, req, res) => {
    res.status(400).send({ error });
  }
);

router.get('/files/:filename', (req, res) => {
  GFS.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file dies not exits, throw error
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // if File exists
    const readstream = GFS.createReadStream(req.params.filename);
    readstream.pipe(res);
  });
});


router.post('/enrollcourse', (req, res) => {
  courseService.enrollCourse(req, res);
});


router.post('/fetchenrollcourses', (req, res) => {
  courseService.fetchEnrollCourses(req, res);
});

module.exports = router;