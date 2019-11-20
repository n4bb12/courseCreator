/* eslint-disable no-restricted-globals */
import React from 'react';
import {Alert} from 'react-bootstrap';

const AlertComponent = (props) => {
    const { text } = props;

    return (
        <Alert>{text}</Alert>
    );
};

export default AlertComponent;