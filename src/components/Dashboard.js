/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Col, Row, Button, Card, Modal, Alert } from 'react-bootstrap';
import Axios from 'axios';
import axiosInstance from '../api';

const Dashboard = () => {

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [storedVideoFiles, setStoredVideoFiles] = useState([]);
    const onInputClick = (e) => {
        e.target.value = '';
    };

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
  
    const baseurl = `http://localhost:8000/course/files/`

    const fetchAllFiles = () =>{
        const { email } = JSON.parse(localStorage.getItem('loggedUser'));

        axiosInstance.post('/course/getallmediacontentadmin', {
            email
        }).then(response => {
            console.log('video files', response.data);
            setStoredVideoFiles(response.data);
        });
    };

    useEffect(() => {
        if(localStorage.getItem('loggedUser')){
            fetchAllFiles();
        }
        else{
            handleShow(true);
        }

    }, []);

    const uploadFilesLocal = (e) => {
        console.log('current files array');
        const currentFileArray = [...uploadedFiles];

        console.log(currentFileArray);
        const { files } = e.nativeEvent.target;
        if (files[0].size >= 10485760) {
            alert('Please select a file smaller that 10mb');
        } else {
            currentFileArray.push(files[0]);
            setUploadedFiles(currentFileArray);
        }
    };

    const removeFile = (param) => {
        uploadedFiles.splice(
            uploadedFiles.findIndex(element => element.name === param.name),
            1
          );
          // console.log(this.ideaAssetDetails);
          setUploadedFiles(uploadedFiles);
    };

    const removeExistingFile = (param) => {
        // console.log(param);
        // console.log(this.ideaAssetDetails.files);
        event.stopPropagation();
        //
    };

    const downloadFile = (filename) => {
        const file = `${baseurl}${filename}`;
        window.open(file);
    };
    
    const uploadAllFiles = () => {
        const { email } = JSON.parse(localStorage.getItem('loggedUser'));

        const formData = new FormData();

        for (let i = 0; i < uploadedFiles.length; i += 1) {
            const file = uploadedFiles[i];
            formData.append('files', file);
        }

        Axios({
            url: 'http://localhost:8000/course/upload',
            method: 'POST',
            params: { email},
            data: formData,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data'
            }
          }).then(fileUploadResponse => {
              console.log(fileUploadResponse);
          }); 
    }

    return (
        <Row style={{ backgroundColor: 'white', margin: '50px', height: '100%', padding: "40px" }}>

        <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Profile Dashboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {!localStorage.getItem('loggedUser') &&  <Alert variant="danger">
            Please login to access your dashboard
            </Alert> }
          </div>
          </Modal.Body>
        <Modal.Footer>
          {!localStorage.getItem('loggedUser') && <googleAuth/>}
        </Modal.Footer>
      </Modal>    

            <Col sm={12}>
                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                    <Tab eventKey="home" title="Student">
                        Student Dashboard
                     </Tab>
                    <Tab eventKey="profile" title="Admin">

                        <Row>
                            <Col sm={9}>
                                <span>Attachments</span>
                            </Col>
                            <Col sm={3}>
                                <a className="addFileLink">
                                    Add Files
                            <input
                                        type="file"
                                        onClick={onInputClick}
                                        onChange={uploadFilesLocal}
                                    />
                                </a>

                            </Col>
                        </Row>

                        <Row>
                            {uploadedFiles.map((element, index) => (
                                <Col sm={12} className="loadedFiles" style={{ margin: '10px' }}>
                                    <Button variant="light">{element.name}
                                    <a style={{marginLeft: '10px'}} onClick={() => removeFile(element)}
                                        className="closeIcon"
                                    >X</a>
                                    </Button>

                                </Col>
                            ))}
                        </Row>
                        <Row>
                        <Col sm={12}><h3>Current Library</h3></Col>    
                        {
                        storedVideoFiles.length > 0 && storedVideoFiles.map(val =>(
                        <Card bg="light" style={{ width: '18rem', margin: '10px' }}>
                            <Card.Header>Type</Card.Header>
                            <Card.Body>
                            <Card.Title>{val.filename}</Card.Title>
                            <Card.Text>
                              <a onClick={() => downloadFile(val.filename)}>Click to download/play</a>  
                            </Card.Text>
                            </Card.Body>
                        </Card>
                            ))}
                        </Row>
                        <Row>
                            <Button variant="success" onClick = {uploadAllFiles}> Upload to Library </Button>

                        </Row>
                    </Tab>
                    <Tab eventKey="contact" title="Contact" disabled>
                        contact dashboard
                    </Tab>
                </Tabs>
            </Col>
        </Row>

    );
};

export default Dashboard;