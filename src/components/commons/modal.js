/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';

const courseCommonModal = (props) => {
    const { text, show , handleCloseFirstModal} = props;
    return (
      <Modal show={show} onHide={handleCloseFirstModal}>
      <Modal.Header>
        <Modal.Title>Title goes here...</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Alert variant="danger">
           {text}
          </Alert> 
        </div>
        </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseFirstModal}>
          Close
          </Button>
      </Modal.Footer>
    </Modal>    

    );
  };

  export default courseCommonModal;