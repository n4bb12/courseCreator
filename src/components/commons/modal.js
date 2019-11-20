/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const courseCommonModal = (props) => {
    const { onHide} = props;
    return (
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

    );
  };

  export default courseCommonModal;