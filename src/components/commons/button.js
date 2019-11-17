/* eslint-disable no-restricted-globals */
import React from 'react';
import Button from 'react-bootstrap/Button';

const ButtonComp = (props) => {
    const { text } = props;

    const submitChange =() =>{
        // eslint-disable-next-line no-undef
        event.preventDefault();
        props.handleOnSubmit();
    };
 
    return (
        <Button variant="primary" onSubmit = {() => submitChange() }>{text}</Button>
    );
};

export default ButtonComp;