/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable class-methods-use-this */
/* eslint-disable lines-between-class-members */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/sort-comp */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

import React from 'react';
import queryString from 'query-string';
import { Card, Row, Col, Tab, Accordion, ListGroup } from 'react-bootstrap';
import axiosInstance from '../../api';
import './course-view.css';

class CourseView extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            baseUrl: 'http://localhost:8000/course/files/',
            courseArr: [], 
            chapterArr: [], 
            contentArr: [], 
            viewedContent: { type: null, content: null, fileUrl: null, fileType: null }
        };
        this.getContentData = this.getContentData.bind(this);
        this.showContent = this.showContent.bind(this);
        this.getAllMediaContent = this.getAllMediaContent.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
    }

    componentDidMount() {
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
            const { baseUrl } = this.state;
            this.setState({ viewedContent: { type: param.contentType, fileUrl: baseUrl + response.data[0].filename, fileType: response.data[0].contentType } });
        });
    }
    

    showContent(param) {  
        if (param.contentType.toLowerCase().trim() === 'textcontent')
         {
            this.setState({ viewedContent: { content: param.content, type: param.contentType } });
        }
        else {
            this.getAllMediaContent(param);
        }
    }



    fetchChapters(param) {
        axiosInstance.post('/chapter/fetchchapters', {
            courseId: param
        }).then(response => {
            this.setState({ chapterArr: response.data.response });
        });

    }

    downloadFile(url){
        window.open(url);
    }


    getContentData(chapter, index) {
        const { chapterArr } = this.state;
        const newChapterArr = [...chapterArr];
        // this.setState({ chapterIndex: index });
        newChapterArr[index].content = [];
        axiosInstance.post('/course/getcontent', {
            chapterId: chapter.chapterId
        }).then(response => {
            this.setState({ contentArr: response.data.response });
            const { contentArr } = this.state;
            contentArr.forEach(val2 => {
                if (chapter.chapterId === val2.chapterId) {
                    newChapterArr[index].content.push(val2);
                }
            });

            this.setState({ chapterArr: newChapterArr });
        });
    };


    render() {
        const { courseArr, chapterArr, viewedContent } = this.state;
        return (
            <>
                {courseArr.map(val => (
                    <Card className="courseCard">
                        <Card.Body>{val.courseName}</Card.Body>
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
                            <div className="contentViewSection">
                                {viewedContent.type === 'textcontent' &&
                                   <div dangerouslySetInnerHTML ={{__html: viewedContent.content}} />
                                }
                                {viewedContent.type === 'filecontent' && viewedContent.fileType.indexOf('video') > -1 &&
                                    <video key={viewedContent.fileUrl} width="100%" height="100%" controls>
                                        <source src={viewedContent.fileUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                }

                                    {viewedContent.type === 'filecontent' && viewedContent.fileType.indexOf('application') > -1 &&
                                    <div><a onClick={()=> this.downloadFile(viewedContent.fileUrl)}>Click here to view the media content</a></div>
                                }
                                   {viewedContent.type === 'filecontent' && viewedContent.fileType.indexOf('image') > -1 &&
                                    <img alt ="no image" style={{width: "100%", height: "100%"}} src={viewedContent.fileUrl} />
                                }
                                {viewedContent.type === 'filecontent' && viewedContent.fileType && <audio controls>
                                <source src={viewedContent.fileUrl} type="audio/mpeg" />
                                Your browser does not support the audio element.
                                </audio>}
                                
                            </div>
                        </Col>
                    </Row>
                </Tab.Container>
            </>
        );
    }

};

export default CourseView;