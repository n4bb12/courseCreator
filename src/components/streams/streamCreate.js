import React from 'react';
import { Field , reduxForm} from 'redux-form';
import Form from 'react-bootstrap/Form'
import { Button } from 'react-bootstrap';

class StreamCreate extends React.Component {

    renderInput({input, label}){
        return ( 
        <Form.Group>
        <Form.Label> {label}</Form.Label>   
        <input 
        {...input}
        />
        </Form.Group>

        )
    }

    onSubmit(formValues){
      console.log(formValues);
    }

    render(){
        return (
            <Form onSubmit={this.props.handleSubmit(this.onSubmit)}>
                <Field name = "title" label="Enter Title" component = {this.renderInput}/>
                <Field name = "description" label="Enter Description" component = {this.renderInput}/>
             <Button variant="primary">Submit</Button> 
            </Form>
        )
    }
}

export default reduxForm({
   form: 'streamCreate' 
})(StreamCreate);