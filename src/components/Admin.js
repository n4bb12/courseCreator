/* eslint-disable no-debugger */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Col, ListGroup, Row, Modal } from 'react-bootstrap';
import axiosInstance from '../api';
import courseCommonModal from './commons/modal';

const Admin = () => {
    const courseDataArr = [{
        name: 'Course Name',
        id: 'courseName',
        placeholder: 'Enter Course Name',
        type: 'text',
        value: ''
    },
    {
        name: 'Subtitle',
        id: 'courseSubtitle',
        placeholder: 'Enter Course Subtitle',
        type: 'text',
        value: ''
    },
    {
        name: 'Description',
        id: 'courseDesc',
        placeholder: 'Enter Description of the Course',
        type: 'textarea',
        value: ''
    },
    {
        name: 'Price',
        id: 'coursePrice',
        placeholder: 'Enter Course Price',
        type: 'text',
        value: ''
    },
    {
        name: 'Duration',
        id: 'courseDuration',
        placeholder: 'Enter Duration of the Course',
        type: 'text',
        value: ''
    }
    ];

    const [courseFormArr, setCourseFormArr] = useState(courseDataArr);
    const [createdCourseArr, setcreatedCourseArr] = useState([]);
    const [viewFlag, setViewFlag] = useState({ create: false, view: true, courseView: false });
    const [selectedCourseObj, setCourseObj] = useState({});
    const [chapterArr, setChapterArr] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [selectedChapter, setChapter] = useState({});
    


    const handleClose = () => setModalShow(false);

    useEffect(() => {
        const { email } = JSON.parse(localStorage.getItem('loggedUser'));
        axiosInstance.get('/course/', {
            params: {
                email
            }
        }).then(response => {
            console.log(response);
            setcreatedCourseArr(response.data.response);
        });
    }, []);

    const submitCourse = () => {
        console.log(courseFormArr);
        axiosInstance.post('/course/create', {
            "courseId": 11,
            "email": "arnab.sadhya@gmail.com",
            "courseName": courseFormArr[0].value,
            "courseSubtitle": courseFormArr[1].value,
            "courseDesc": courseFormArr[2].value,
            "coursePrice": courseFormArr[3].value,
            "courseDuration": courseFormArr[4].value
        }).then(response => {
            console.info('Course Created Successfully', response);
        });
    };

    const updateCourse = () => {
        axiosInstance.put('/course/update', {
            "courseId": 11,
            "courseName": courseFormArr[0].value,
            "courseSubtitle": courseFormArr[1].value,
            "courseDesc": courseFormArr[2].value,
            "coursePrice": courseFormArr[3].value,
            "courseDuration": courseFormArr[4].value
        }).then(response => {
            console.log('succesfully updated', response);
            alert('changing the view, update succesful');
            setViewFlag({ create: false, view: true });
        });
    };

    const handleInputChange = (e, index) => {
        const newArr = [...courseFormArr];
        newArr[index].value = e.target.value;
        setCourseFormArr(newArr);
    };

    const selectView = (param) => {
        if (param === 'create') {
            setViewFlag({ create: true, view: false });
        }
        else if (param === 'view') {
            setViewFlag({ create: false, view: true });
        }
    };

    const editCourse = (selectedCourse) => {
        console.log(selectedCourse);
        const tempArr = [...courseFormArr];
        debugger;
        tempArr.forEach(val => {
            if (val.id in selectedCourse) {
                val.value = selectedCourse[val.id];
            }
        });
        console.log(tempArr);
        setViewFlag({ create: true, view: false });
    };


    const selectCourse = (param = {}) => {
        console.log(param);
        setViewFlag({ create: false, view: false, courseView: true });
        setCourseObj(param);
        axiosInstance.post('/course/fetchchapters', {
            email: 'arnab.sadhya@gmail.com',
            courseId: param.courseId
        }).then(response => {
            console.log('chapter for courses', response);
            setChapterArr(response.data.response);
        });

    };

    const addChapter = (_courseData) => {
        axiosInstance.post('/course/addchapter', {
            courseId: _courseData.courseId,
            chapterTitle: "New Chapter 1",
            chapterOrder: 1,
            chapterId: 1,
            email: 'arnab.sadhya@gmail.com'
        }).then(response => {
            console.info('Chapter Created Successfully', response);
        });
    };


   const setDataAndOpenModal = (data) => {
       console.log(data);
       setModalShow(true);
       setChapter(data);
   };


    return (
        <Row style={{ margin: '30px' }}>
            <Modal show={modalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                onHide={handleClose}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Add Content
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Content Title</Form.Label>
                            <Form.Control type="text" placeholder="Content Title" />
                        </Form.Group>
                        <fieldset>
                            <Form.Group as={Row}>
                                <Form.Label as="legend" column sm={2}>
                                    Select Content Type
      </Form.Label>
                                <Col sm={10}>
                                    <Form.Check
                                        type="radio"
                                        label="Text/HTML"
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios1"
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="File Upload"
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios2"
                                    />
                                </Col>
                            </Form.Group>
                        </fieldset>

                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Example textarea</Form.Label>
                            <Form.Control as="textarea" rows="3" />
                        </Form.Group>
                        <Form.Group> <Form.Label>Upload file </Form.Label>   <input type="file" /> </Form.Group>
                    
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>Add</Button>
                </Modal.Footer>
            </Modal>                <Col sm={4}>
                <ListGroup style={{ cursor: 'pointer' }}>
                    <ListGroup.Item className={viewFlag.create ? 'active' : 'inactive'} onClick={() => selectView('create')}>Create new course</ListGroup.Item>
                    <ListGroup.Item className={viewFlag.view ? 'active' : 'inactive'} onClick={() => selectView('view')}>View/Edit Course</ListGroup.Item>
                </ListGroup>
            </Col>

            <Col sm={8} style={{ backgroundColor: 'white' }}>

                <div className="courseView">
                    <Row>
                        {viewFlag.view && createdCourseArr.map(val => (
                            <Col sm={4}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{val.courseName}</Card.Title>
                                        <Card.Text>
                                            {val.courseDesc}
                                        </Card.Text>
                                        <Card.Text>Price: {val.coursePrice}</Card.Text>
                                        <Button variant="primary" style={{ marginRight: '10px' }} onClick={() => selectCourse(val)}>Select Course</Button>

                                        <Button variant="primary" style={{ marginRight: '10px' }} onClick={() => editCourse(val)}>Edit Course</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                        {viewFlag.courseView && <div>
                            <p>Name : {selectedCourseObj.courseName}</p>
                            <p>Price : {selectedCourseObj.price}</p>
                            <Button variant="primary" onClick={() => addChapter(selectedCourseObj)}>Add Chapter</Button>
                            <div id="chapters">
                                {chapterArr.map(val => (
                                    <Card>
                                        <Card.Header>{val.chapterTitle}</Card.Header>
                                        <Card.Body>
                                            <Card.Text>
                                                Add Content here...
                               </Card.Text>
                                            <Button variant="primary" onClick={() => setDataAndOpenModal(val)}>Add Content</Button>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                            <div id="content">
                                <p>content loads here</p>
                                <video width="320" height="240" controls>
                                    <source src="http://localhost:8000/course/files/video1.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                            </video>
                            </div>
                        </div>
                        }
                    </Row>

                </div>


                <div className="courseCreate">
                    {viewFlag.create &&
                        <Form>
                            {courseFormArr.map((val, index) => (
                                <Form.Group key={val.id} controlId={val.id}>
                                    <Form.Label>{val.name}</Form.Label>
                                    <Form.Control type="text" placeholder={val.placeholder} value={val.value} onChange={() => handleInputChange(event, index)} />
                                </Form.Group>
                            ))
                            }
                            {/*    <ButtonComp text="Add Course" handleOnSubmit = {() => submitCourse()} />   */}
                            <Button variant="primary" onClick={submitCourse} style={{ marginRight: '10px' }}>ADD COURSE</Button>
                            <Button variant="primary" onClick={updateCourse}>Update Course</Button>
                        </Form>
                    }
                </div>


            </Col>
        </Row>

    );
};

export default Admin;