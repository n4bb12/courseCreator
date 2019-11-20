/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable radix */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable no-debugger */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Col, ListGroup, Row, Modal, Alert, Accordion } from 'react-bootstrap';
import Axios from 'axios';
import { useHistory } from "react-router-dom";
import CKEditor from 'ckeditor4-react';
import axiosInstance from '../../api';
import './Admin.css';
import googleAuth from '../googleAuth';

const uniqid = require('uniqid');

// import courseCommonModal from './commons/modal';

const Admin = () => {
    const history = useHistory();
    const baseUrl =  'http://localhost:8000/course/files/';

    // course form array which will generate the form fields
    const courseDataArr = [{
        name: 'Course Name',
        id: 'courseName',
        placeholder: 'Enter Course Name, not to exceed 255 characters',
        type: 'text',
        value: '',
        maxlength: 255
    },
    {
        name: 'Subtitle',
        id: 'courseSubtitle',
        placeholder: 'Enter Course Subtitle, not to exceed 255 characters',
        type: 'text',
        value: '',
        maxlength: 255
    },
    {
        name: 'Description',
        id: 'courseDesc',
        placeholder: 'Enter Description of the Course',
        type: 'textarea',
        value: '',
        maxlength: 255
    },
    {
        name: 'Price ($)',
        id: 'coursePrice',
        placeholder: 'Enter Course Price',
        type: 'text',
        value: '',
        maxlength: 8
    },
    {
        name: 'Duration (hrs)',
        id: 'courseDuration',
        placeholder: 'Enter Duration of the Course',
        type: 'text',
        value: '',
        maxlength: 5
    }
    ];

    // all the state values are initialized here

    const [courseFormArr, setCourseFormArr] = useState(courseDataArr);
    const [createdCourseArr, setcreatedCourseArr] = useState([]);
    const [viewFlag, setViewFlag] = useState({ create: false, view: true, courseView: false , update: false });
    const [validationError, setValidationError ] = useState({flag: false , text: ''});
    const [selectedCourseObj, setCourseObj] = useState({});
    const [chapterArr, setChapterArr] = useState([]);
    const [contentArr, setContentArr] = useState([]);
    const [modalShow, setModalShow] = useState(false);

    const [showChapterModal, setChapterModal] = useState(false);
    const [selectedChapter, setChapter] = useState({});
    const [fileArr, setFileArr] = useState([]);
    const [chapterCreateUpdateFlag, setChapterCreateUpdateFlag] = useState({create: true, update: false});
    const [contentCreateUpdateFlag, setContentCreateUpdateFlag] = useState({create: true, update: false});
    const [textFileContentFlag, setTextFileContentFlag] = useState({textcontent: true, filecontent: false});

    const [newChapterData, setNewChapterData] = useState({title: '', order: ''});
    const [newContentData, setNewContentData] = useState({title: '', order: '', content: '', type: 'textcontent'});
    const [loadedMediaContent, updateLoadedMediaContent] = useState('');

    // content modal
    const handleClose = () => setModalShow(false);

    // chapter modal
    const handleChapterModal = () => setChapterModal(false);
    const [show, setShow] = useState(false);

    const handleCloseFirstModal = () => setShow(false);
    const handleShowFirstModal = () => setShow(true);


    // fetching all the courses
    const fetchAllCourses = () => {
        const { email } = JSON.parse(localStorage.getItem('loggedUser'));
        axiosInstance.get('/course/', {
            params: {
                email,
                view: 'admin'
            }
        }).then(courseresponse => {
            // console.log('fetched updated course successfully', courseresponse);
            setcreatedCourseArr(courseresponse.data.response);
        }).catch(error => {
            console.warn(error);
        });
    };


    useEffect(() => {
        if(!localStorage.getItem('loggedUser')){
            handleShowFirstModal();
        }
        else{
           /*  const { email } = JSON.parse(localStorage.getItem('loggedUser'));

           // fetching all the course if user is logged in
            axiosInstance.get('/course/', {
                params: {
                    email,
                    view: 'admin'
                }
            }).then(response => {
                setcreatedCourseArr(response.data.response);
            }).catch(error => {
                console.warn(error);
            }); */

            fetchAllCourses();
        }

    }, []);


    // function to invoke when course is getting created
    const submitCourse = () => {
        const { email } = JSON.parse(localStorage.getItem('loggedUser'));
        // console.log(courseFormArr);

        if(courseFormArr.some( el => el.value === ''))
        {
            // show modal alert here TO DO
            alert('Please fill all the fields');
            return;
        }

        axiosInstance.post('/course/create', {
            "courseId": uniqid(),
            "email": email,
            "courseName": courseFormArr[0].value,
            "courseSubtitle": courseFormArr[1].value,
            "courseDesc": courseFormArr[2].value,
            "coursePrice": courseFormArr[3].value,
            "courseDuration": courseFormArr[4].value,
            "status": "draft"
        }).then(response => {
            console.info('Course Created Successfully', response);
            setViewFlag({ create: false, view: true });
            // refreshing course view
            fetchAllCourses();
        }).catch(error => {
            console.warn(error);
        });
    };


    // updating a specific course

    const updateCourse = (status) => {
        axiosInstance.put('/course/update', {
            "courseId": selectedCourseObj.courseId,
            "courseName": courseFormArr[0].value,
            "courseSubtitle": courseFormArr[1].value,
            "courseDesc": courseFormArr[2].value,
            "coursePrice": courseFormArr[3].value,
            "courseDuration": courseFormArr[4].value,
            "status": status || selectedCourseObj.status
        }).then(response => {
            // console.log('succesfully updated', response);

            // remove alert later TO DO with a popup or loading
            if(response)
            alert('changing the view, update succesfull');
            setViewFlag({ create: false, view: true });
        });
    };

    // publishing course

    const publishCourse = (val)  => {
        console.log(val);
        axiosInstance.patch('/course/updatestatus', { courseId: val.courseId, status: 'published' },
        ).then(response => {
             console.log(response);
        }).catch(error => {
            console.warn(error);
        });
    };

    // onchange event triggrred when course form input gets changed

    const handleInputChange = (e, index , id = '') => {
        const newArr = [...courseFormArr];
        if(id === 'courseDesc'){
            newArr[index].value = e.editor.getData();
        }
        else{
            newArr[index].value = e.target.value;
        }

        setCourseFormArr(newArr);
    };

    // on blur method to handle validations

    const handleBlur = (e,index) =>  {

        // console.log(e.target.id);
        // console.log(`value${  e.target.value}`);
        const {id} = e.target;
        let num;
        let cleanNum;
        const newArr = [...courseFormArr];
        if(id === 'courseDuration'){
            const currentInputValue = parseInt(e.target.value);

            if(isNaN(currentInputValue)){
                console.warn('please enter numeric value');
                setValidationError({flag: true, text: 'Please enter numeric value,it will be rounded to 1' });
                newArr[index].value = '';
                setCourseFormArr(newArr);
                return;
            }
                setValidationError({flag: false, text: '' });
                num = parseFloat(e.target.value);
                cleanNum = num.toFixed(1);
                newArr[index].value = cleanNum;
                
        }
        else if( id === 'coursePrice'){
            const currentInputValue = parseInt(e.target.value);
            if(isNaN(currentInputValue)){
                console.warn('please enter numeric value');
                setValidationError({flag: true, text: 'Please enter numeric value,it will be rounded to 2' });
                newArr[index].value = '';
                setCourseFormArr(newArr);
                return;
            } 
            
                num = parseFloat(e.target.value);
                cleanNum = num.toFixed(2);
                setValidationError({flag: false, text: '' });
                newArr[index].value = cleanNum;

        }
        setCourseFormArr(newArr);
      };


    // selecting view as course create or view

    const selectView = (param) => {
        if (param === 'create') {
            const tempArr = [...courseFormArr];
            tempArr.forEach(val => {
                val.value = '';
            });
            setViewFlag({ create: true, view: false , update: false});
        }
        else if (param === 'view') {
            setViewFlag({ create: false, view: true, update: false });
        }
    };

    // edit a course 
    const editCourse = (selectedCourse) => {
        // console.log(selectedCourse);
        setCourseObj(selectedCourse);

        const tempArr = [...courseFormArr];
        tempArr.forEach(val => {
            if (val.id in selectedCourse) {
                val.value = selectedCourse[val.id];
            }
        });
        setViewFlag({ create: true, view: false , update: true });
    };

    // select a course to view all the chapters

    const selectCourse = (param = {}) => {
        const { email } = JSON.parse(localStorage.getItem('loggedUser'));
        setViewFlag({ create: false, view: false, courseView: true });
        setCourseObj(param);
        axiosInstance.post('/chapter/fetchchapters', {
            email,
            courseId: param.courseId
        }).then(response => {
            // console.log('chapter for courses', response);
            setChapterArr(response.data.response);
        }).catch(error => {
            console.warn(error);
        });

    };

// when chapter modal opend

const editChapterOpenModal = (chapterObj) => {
    setChapterCreateUpdateFlag({create: false, update: true});
    const existingChapterData = {...newChapterData};
    existingChapterData.title = chapterObj.chapterTitle;
    existingChapterData.order = chapterObj.chapterOrder;
    existingChapterData.chapterId = chapterObj.chapterId;
    existingChapterData.courseId = chapterObj.courseId;
    setNewChapterData(existingChapterData);
    setChapterModal(true);
};

// sync current chapters upon update

const syncCurrentChapters = (passedCourseId) => {
    const { email } = JSON.parse(localStorage.getItem('loggedUser'));

    axiosInstance.post('/chapter/fetchchapters', {
        email,
        courseId: passedCourseId
    }).then(chapRes => {
        // console.log('chapter for courses', chapRes);
        handleChapterModal();
        setChapterArr(chapRes.data.response);
    });
};

// update chapter

const updateChapter = () => {
    const { email } = JSON.parse(localStorage.getItem('loggedUser'));

    axiosInstance.put('/chapter/updatechapter', {
        chapterId: newChapterData.chapterId,
        courseId: newChapterData.courseId,
        chapterTitle: newChapterData.title,
        chapterOrder: newChapterData.order,
        email
    }).then(response => {
        if(response)
        syncCurrentChapters(newChapterData.courseId);
    }).catch(error => {
        console.warn(error);
    });
};

    const saveChapter = () => {
        const { email } = JSON.parse(localStorage.getItem('loggedUser'));

        axiosInstance.post('/chapter/addchapter', {
            courseId: newChapterData.courseId,
            chapterTitle: newChapterData.title,
            chapterOrder: newChapterData.order,
            chapterId: uniqid(),
            email
        }).then(response => {
            console.info('Chapter Created Successfully', response);
            syncCurrentChapters(newChapterData.courseId);
        });
    };

    // content code starts/////////

    const handleFileUpload = (event) => {
        debugger;
        const { files } = event.nativeEvent.target;
        if (files[0].size >= 10485760) {
            alert('Please select a file smaller that 10mb');
        } else {
            const fileArray = Array.from(event.nativeEvent.target.files);
            setFileArr(fileArray);
        }
    };

    // handle onchange for content modal

    const handleContentInput = (event, source) => {
        if(source === 'addchaptername')
        {
            setNewChapterData({...newChapterData, title: event.target.value, courseId: selectedCourseObj.courseId});
        }
        if(source === 'addchapterorder'){
            setNewChapterData({...newChapterData,order: event.target.value, courseId: selectedCourseObj.courseId});
        }
        if(source === 'addcontenttile'){
            setNewContentData({...newContentData, title: event.target.value, chapterId: newContentData.chapterId });
        }
        if(source === 'addcontentorder'){
            setNewContentData({...newContentData, order: event.target.value, chapterId: newContentData.chapterId });
        }
        if(source === 'addcontenttext'){
            setNewContentData({...newContentData, content: event.editor.getData(), chapterId: newContentData.chapterId });
        }
    };

    const setDataAndOpenModal = (data) => {
        setModalShow(true);
        setChapter(data);
        setNewContentData({title: '', order: '' , content: ''});
    };

    const getAllMediaContent = (contentId) => {
        axiosInstance.post('/course/getallmediacontent', {
            contentId
        }).then(response => {
             console.log('video files', response.data[0]);
             updateLoadedMediaContent(response.data[0]);
        });
    };

    const editContentOpenModal = (editedContent) => {
        // console.log(editedContent);
        const {contentType} = editedContent;

        if(contentType === 'textcontent'){
            setTextFileContentFlag({textcontent: true, filecontent: false});

        }
        else{
            setTextFileContentFlag({textcontent: false, filecontent: true});

        }


        setModalShow(true);
       const existingContentData = {...newContentData};
       // console.log(existingContentData);
       existingContentData.title = editedContent.contentTitle;
       existingContentData.order = editedContent.contentOrder;
       existingContentData.content = editedContent.content;
       existingContentData.contentId =editedContent.contentId;
       existingContentData.chapterId = editedContent.chapterId;
       getAllMediaContent(existingContentData.contentId);
       setNewContentData(existingContentData);
    };

    const getContentData = (val) => {
        // console.log('chapter selected', val);
        axiosInstance.post('/course/getcontent',{
            chapterId: val.chapterId
        }).then(response => {
            // console.log(response.data.response);
            setContentArr(response.data.response);
        }).catch(error => {
            console.warn(error);
        });
    };

    const createContent = () => {
          axiosInstance.post('/course/addcontent', {
                "contentTitle": newContentData.title,
                "contentId": uniqid(),
                "chapterId": selectedChapter.chapterId,
                "contentType":newContentData.type ?  newContentData.type : "textcontent",
                "content": newContentData.content,
                "contentOrder":newContentData.order
            }).then(response => {
                // console.log('created content', response);
                // getContentData(selectedChapter.chapterId);
                const {contentId} = response.data.response;
                // console.log(`content id is ${  contentId}`);
                // if there is file associated with it then upload the  file in chunks
             if(newContentData.type === 'filecontent'){
                const formData = new FormData();

                for (let i = 0; i < fileArr.length; i += 1) {
                    const file = fileArr[i];
                    formData.append('files', file);
                }
      
              Axios({
                    url: 'http://localhost:8000/course/upload',
                    method: 'POST',
                    params: { contentId},
                    data: formData,
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'multipart/form-data'
                    }
                  }).then(fileUploadResponse => {
                        console.log(fileUploadResponse);
                  }).catch(error => {
                    console.warn(error);
                }); 
             } 
             
             setContentArr(response.data.response);
             setModalShow(false);
             getContentData(selectedChapter.chapterId);

            }).catch(error => {
                console.warn(error);
            });


    };
    const updateContent = () => {
        // console.log("before updating content", newContentData);
        axiosInstance.put('/course/updatecontent',{
            "contentId": newContentData.contentId,
            "contentTitle": newContentData.title,
            "chapterId": newContentData.chapterId,
            "contentType": newContentData.type ? newContentData.type : 'textcontent',
            "content": newContentData.content,
            "contentOrder":newContentData.order
        }).then(response => {
            console.log(response);
        }).catch(error => {
            console.warn(error);
        });
    };

    const handleRadioClick = (event) => {
        newContentData.type = event.target.value;
        if(newContentData.type === 'textcontent'){
            setTextFileContentFlag({textcontent: true, filecontent: false});
        }
        else{
            setTextFileContentFlag({textcontent: false, filecontent: true});
        }
    };


   

    const selectChapterForContent = (event) => {
        const newChapter = event.target.value;
        setNewContentData({...newContentData, chapterId: newChapter });
    };


    const downloadFile = (filename) => {
        const file = `${baseUrl}${filename}`;
        window.open(file);
    };

    return (
        <Row style={{ margin: '30px' }}>
  <Modal show={show} onHide={handleCloseFirstModal}>
        <Modal.Header>
          <Modal.Title>Create Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {!localStorage.getItem('loggedUser') &&  <Alert variant="danger">
            Please login to create a course
            </Alert> }
          </div>
          </Modal.Body>
        <Modal.Footer>
          {localStorage.getItem('loggedUser') && <Button variant="secondary" onClick={handleCloseFirstModal}>
            Close
          </Button>}
          {!localStorage.getItem('loggedUser') && <googleAuth/>}
        </Modal.Footer>
      </Modal>    



            <Modal show={showChapterModal} onHide={handleChapterModal}>
                    <Modal.Header closeButton>
                    <Modal.Title>Add a chapter</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBasicTitle">
                            <Form.Label>Chapter Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter Chapter Name" 
                            value ={newChapterData.title} 
                            maxLength ="255"
                            onChange= {(event) => handleContentInput(event,'addchaptername',)} />
                             <Form.Text className="text-muted">
                                       Total length remaining {255 - newChapterData.title.length}
                                    </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formBasicOrder">
                            <Form.Label>Order</Form.Label>
                            <Form.Control type="text" placeholder="Chapter Order" 
                            value ={newChapterData.order} 
                            onChange= {(event) => handleContentInput(event, 'addchapterorder')} />
                        </Form.Group>
                        </Form>

                    </Modal.Body>
                    <Modal.Footer>
                    {chapterCreateUpdateFlag.create === true? <Button variant="primary" onClick={saveChapter}>
                        Create
                     </Button> : ''}

                    {chapterCreateUpdateFlag.update === true ? <Button variant ="success" onClick={updateChapter}>Update</Button> : ''}

                    </Modal.Footer>
                </Modal>


            <Modal show={modalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                onHide={handleClose}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Chapter Content
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Content Title</Form.Label>
                            <Form.Control type="text" 
                            placeholder="Content Title"
                            value ={newContentData.title} 
                            maxLength ="255"
                            onChange= {(event) => handleContentInput(event, 'addcontenttile')}/>
                             <Form.Text className="text-muted">
                                       Total length remaining {255 - newContentData.title.length}
                                    </Form.Text>
                        </Form.Group>

                        {contentCreateUpdateFlag.update === true &&
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Chapter</Form.Label>
                            <Form.Control as="select" onClick={() => selectChapterForContent(event)}>
                                {chapterArr.map(val => (
                                    <option value={val.chapterId}>{val.chapterTitle}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        }
                            <Form.Group controlId="formBasicEmail">
                            <Form.Label>Content Order</Form.Label>
                            <Form.Control type="text" placeholder="Content Order"
                            value ={newContentData.order} 
                            onChange= {(event) => handleContentInput(event, 'addcontentorder')}/>
                        </Form.Group>
                        <fieldset>
                            <Form.Group as={Row}>
                                <Form.Label as="legend" column sm={4}>
                                    Select Content Type
                                 </Form.Label>
                                <Col sm={10}>
                                    <Form.Check
                                        type="radio"
                                        label="Text/HTML"
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios1"
                                        checked={textFileContentFlag.textcontent}
                                        value="textcontent"
                                        onChange= {(event) => handleRadioClick(event)}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="File Upload"
                                        name="formHorizontalRadios"
                                        checked = {textFileContentFlag.filecontent}
                                        id="formHorizontalRadios2"
                                        value="filecontent"
                                        onChange= {(event) => handleRadioClick(event)}
                                    />
                                </Col>
                            </Form.Group>
                        </fieldset>

                        { textFileContentFlag.textcontent === true ? <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Content</Form.Label>

                      {/*      <Form.Control as="textarea" rows="3" 
                            value ={newContentData.content} 
                            id="contentTextArea"
                            onChange= {(event) => handleContentInput(event,'addcontenttext')} /> */}

                            <CKEditor data={newContentData.content}  onChange= {(event) => handleContentInput(event,'addcontenttext')}/>
                        </Form.Group> : ''}
                        { textFileContentFlag.filecontent === true ? <Form.Group> <Form.Label>Upload file </Form.Label>
                            <input type="file" onChange={handleFileUpload} /> </Form.Group> : ''}

                    </Form>
                    {loadedMediaContent !=='' && <a onClick={() => downloadFile(loadedMediaContent.filename)}>Click to open existing content</a> }
                </Modal.Body>
                <Modal.Footer>
                    {contentCreateUpdateFlag.create === true ? <Button onClick={createContent}>Create</Button> : ''}
                    {contentCreateUpdateFlag.update === true ? <Button onClick={updateContent}>Update</Button>  : ''}
                </Modal.Footer>
            </Modal>                
            
            <Col sm={3}>
                <ListGroup style={{ cursor: 'pointer' }}>
                    <ListGroup.Item className={viewFlag.create ? 'active' : 'inactive'} onClick={() => selectView('create')}>Create new course</ListGroup.Item>
                    <ListGroup.Item className={(viewFlag.view === true || viewFlag.courseView === true )  ? 'active' : 'inactive'} onClick={() => selectView('view')}>View/Edit Course</ListGroup.Item>
                </ListGroup>
            </Col>

            <Col sm={9} className="courseSection">

                    <Row>
                    {createdCourseArr.length === 0 && viewFlag.view && 
                    <div style={{margin:'auto'}}>
                    <Alert variant="info">
                            You have not created a course yet, Feel free to create one
                    </Alert>
                    </div>
                    }
                        {viewFlag.view && createdCourseArr.map((val) => (
                            <Col sm={5} key={val.courseName}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{val.courseName}</Card.Title>
                                        <Card.Title>Status: {val.status}</Card.Title>
                                        <Card.Text dangerouslySetInnerHTML ={{__html: val.courseDesc}}>
                                           
                                        </Card.Text>
                                        <Card.Text>Price: ${val.coursePrice}</Card.Text>
                                        <Button variant="primary" style={{ marginRight: '10px' }} onClick={() => selectCourse(val)}>Select Course</Button>
                                        <Button variant="success" onClick={() => {
                                                history.push(`/view-course?id=${val.courseId}`);
                                        }}>Preview Course</Button>
                                        <Button variant="warning" style={{ marginRight: '10px', marginTop:'10px' }} onClick={() => editCourse(val)}>Edit Course</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                        {viewFlag.courseView &&  
                        <Col sm={12} id="chapters">
                            <div className="selectedChapterSection">
                            <p>Name : {selectedCourseObj.courseName}</p>
                            <p>Price : ${selectedCourseObj.coursePrice}</p>
                            {selectedCourseObj.status !== 'published' && <Button variant="success" style={{margin:'5px'}} onClick={() => publishCourse(selectedCourseObj)}>Publish Course</Button>}
                            <Button variant="primary" onClick={() =>  {
                                setChapterCreateUpdateFlag({create: true, update: false});
                                setChapterModal(true);
                                }}>Add Chapter</Button>
                            </div>
                            <Accordion>

                                {chapterArr.map((val,index) => (

                                        <Card key={val.chapterId}>
                                            <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey={index} onClick={() => getContentData(val)}>
                                            {val.chapterTitle}
                                            </Accordion.Toggle>
                                            <Button className="updateChapterBtn" variant="secondary" onClick={() => editChapterOpenModal(val)}>Update Chapter</Button>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey={index}>
                                            <Card.Body>
                                            {contentArr.length === 0 && <div>No Content</div>}    
                                            {contentArr.length > 0 && contentArr.map(contentRes => (
                                                <div className="contentSection">
                                                    <Button className="updateChapterBtn" onClick={() => {
                                                        setContentCreateUpdateFlag({create: false, update: true});
                                                        editContentOpenModal(contentRes);
                                                       }
                                                    }>Edit Content</Button>
                                                    <p>{contentRes.contentTitle}</p>
                                                    <p>{contentRes.content}</p>
                                                 </div>   
                                            ))}
                                            <Button variant="info" onClick={() => {
                                                setContentCreateUpdateFlag({create: true, update: false});
                                                setDataAndOpenModal(val);
                                                }
                                            }>Add Content</Button>
                                            </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                ))}
                            </Accordion>
                        </Col>
                        }
                    </Row>


                <div className="courseCreate">
                    {viewFlag.create &&
                        <Form>
                            {courseFormArr.map((val, index) => (
                                <Form.Group key={val.id} controlId={val.id}>
                                    <Form.Label>{val.name}</Form.Label>
                                    {val.id !== 'courseDesc' && <Form.Control required maxLength ={val.maxlength} type="text" placeholder={val.placeholder} value={val.value} 
                                    onChange={() => handleInputChange(event, index)} 
                                    onBlur={(event) => handleBlur(event, index)}
                                     /> }

                                    {val.id === 'courseDesc' &&     <CKEditor data={val.value}   onChange={(event) => handleInputChange(event, index, val.id)} />}
                                    
                                    {(val.id === 'courseName' || val.id === 'courseSubtitle') && <Form.Text className="text-muted">
                                       Total length remaining {val.maxlength - val.value.length}
                                    </Form.Text>
                                    }

                                    {(val.id === 'coursePrice' || val.id === 'courseDuration') && validationError.flag && <Form.Text className="text-muted">
                                       {validationError.text}
                                    </Form.Text>
                                    }

                                </Form.Group>
                            ))
                            }
                            {/*    <ButtonComp text="Add Course" handleOnSubmit = {() => submitCourse()} />   */}
                            
                           {viewFlag.update === false  && <Button variant="primary" onClick={submitCourse} style={{ marginRight: '10px' }}>ADD COURSE</Button> }
                           {viewFlag.update === true && <Button variant="info" onClick={() => updateCourse('')}>Update Course</Button> }
                        </Form>
                    }
                </div>


            </Col>
        </Row>

    );
};

export default Admin;