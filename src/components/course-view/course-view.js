/* eslint-disable class-methods-use-this */
/* eslint-disable lines-between-class-members */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/sort-comp */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
import React from 'react';
import queryString from 'query-string';
import { Card, Row, Col, Nav, Tab, Accordion, ListGroup } from 'react-bootstrap';
import axiosInstance from '../../api';

class CourseView extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            baseUrl: 'http://localhost:8000/course/files/',
            courseArr: [], 
            chapterArr: [], 
            contentArr: [], 
            chapterIndex: 0, 
            viewedContent: { type: null, content: null, fileUrl: null }
        };
        this.getContentData = this.getContentData.bind(this);
        this.showContent = this.showContent.bind(this);
        this.getAllMediaContent = this.getAllMediaContent.bind(this);
    }

    componentDidMount() {
        //this.getAllMediaContent();
        // const { email } = JSON.parse(localStorage.getItem('loggedUser'));
        const params = queryString.parse(location.search);
        axiosInstance.get('/course/', {
            params: {
                courseId: params.id,
                view: 'user'
            }
        }).then(response => {
            this.setState({ courseArr: response.data.response });
            this.fetchChapters(params.id);
        });
    }

    getAllMediaContent(param) {
        axiosInstance.post('/course/getallmediacontent', {
            contentId: param.contentId
        }).then(response => {
            console.log('video files', response.data[0]);
            const { baseUrl } = this.state;
            this.setState({ viewedContent: { type: param.contentType, fileUrl: baseUrl + response.data[0].filename } });
        });
    }

    showContent(param) {
        console.log(param);
        if (param.contentType === 'text') {
            this.setState({ viewedContent: { content: param.content, type: param.contentType } });
        }
        else {
            this.getAllMediaContent(param);
        }
    }



    fetchChapters(param) {
        axiosInstance.post('/course/fetchchapters', {
            courseId: param
        }).then(response => {
            console.log('chapter for courses', response);
            this.setState({ chapterArr: response.data.response });
        });

    }


    getContentData(chapter, index) {
        const { chapterArr } = this.state;
        const newChapterArr = [...chapterArr];
        this.setState({ chapterIndex: index });
        newChapterArr[index].content = [];
        axiosInstance.post('/course/getcontent', {
            chapterId: chapter.chapterId
        }).then(response => {
            console.log(response.data.response);
            this.setState({ contentArr: response.data.response });
            const { contentArr } = this.state;
            contentArr.forEach(val2 => {
                if (chapter.chapterId === val2.chapterId) {
                    newChapterArr[index].content.push(val2);
                }
            });

            this.setState({ chapterArr: newChapterArr });
        });
        console.log(this.state);
    };


    render() {
        const { courseArr, chapterArr, viewedContent } = this.state;
        return (
            <>
                {courseArr.map(val => (
                    <Card>
                        <Card.Body>Course - {val.courseName}</Card.Body>
                    </Card>
                ))}

                <Tab.Container id="left-tabs-example" defaultActiveKey="0">
                    <Row>
                        <Col sm={3}>
                            <Accordion defaultActiveKey="0">
                                {chapterArr.map((chapter, index) => (
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey={index} onClick={() => this.getContentData(chapter, index)}>
                                            {chapter.chapterTitle}
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey={index}>
                                            <Card.Body>
                                                <ListGroup>
                                                    {chapter.hasOwnProperty('content') > 0 && chapter.content.map(content => (
                                                        <ListGroup.Item onClick={() => this.showContent(content)}> {content.contentTitle}</ListGroup.Item>
                                                    ))}
                                                </ListGroup>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>

                                ))}
                            </Accordion>
                        </Col>
                        <Col sm={9}>
                            <div style={{ backgroundColor: "white", width: "100%", height: "100%", padding: "20px" }}>
                                {viewedContent.type === 'text' &&
                                    <p>{viewedContent.content}</p>
                                }
                                {viewedContent.type === 'filecontent' &&
                                    <video key={viewedContent.fileUrl} width="100%" height="100%" controls>
                                        <source src={viewedContent.fileUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                }
                            </div>
                        </Col>
                    </Row>
                </Tab.Container>
            </>
        );
    }

};

export default CourseView;