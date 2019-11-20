/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import {signIn, signOut} from '../actions';

class GoogleAuth extends React.Component {


    constructor(props){
        super(props);
        this.state = {isSignedIn: null, loggedUserObj: { name: 'NA', email: 'NA'}};
    }

    componentDidMount(){
        window.gapi.load('client:auth2', () => {
            window.gapi.client.init({
                clientId:'60551017505-5pgllkfuik4oklq2p30uiqpc809687k7.apps.googleusercontent.com',
                scope:'email'
            }).then(() => {
                this.auth = window.gapi.auth2.getAuthInstance();
                // this.setState({isSignedIn: this.auth.isSignedIn.get()});
                
                this.onAuthChange(this.auth.isSignedIn.get());
                this.auth.isSignedIn.listen(this.onAuthChange);
            });
        });
    }

    onSignInClick = () => {
        this.auth.signIn();
    }

    onSignOutClick = () => {  
        localStorage.removeItem('loggedUser');
        this.auth.signOut();
        window.location.reload();
    }

    onAuthChange = (isSignedIn) => {
        // this.setState({isSignedIn: this.auth.isSignedIn.get()});
        if(isSignedIn){
            this.props.signIn(this.auth.currentUser.get().getId());
            this.setState({loggedUserObj: {name: this.auth.currentUser.Ab.w3.ig, email:this.auth.currentUser.Ab.w3.U3}});
            localStorage.setItem('loggedUser', JSON.stringify(this.state.loggedUserObj));
        }
        else{
            this.props.signOut();
        }
    }

    renderAuthButton(){
        const { loggedUserObj} = this.state;
        const { isSignedIn} = this.props;
        if(isSignedIn === null){
            return <div>Please login to continue</div>;
        }
        if(isSignedIn){
            return (
            <>
                <span>Welcome {loggedUserObj.name}</span>
                <Button variant ="info" onClick={this.onSignOutClick} style={{marginLeft: '10px'}} >Sign Out</Button>
            </>    
           
            );    
        }
        
            return <Button variant ="primary" onClick={this.onSignInClick}>Sign in with google</Button>;

        
    } 

    render(){
        return <div>{this.renderAuthButton()}</div>;
    }
}

const mapStateToProps = (state) => {
    return {
        isSignedIn: state.auth.isSignedIn
    };
};

export default connect(mapStateToProps, { signIn,signOut })(GoogleAuth);
