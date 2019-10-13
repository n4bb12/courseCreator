import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import {signIn, signOut} from '../actions';

class GoogleAuth extends React.Component {

    state = {isSignedIn: null};

    componentDidMount(){
        window.gapi.load('client:auth2', () => {
            window.gapi.client.init({
                clientId:'XXXXX',
                scope:'email'
            }).then(() => {
                this.auth = window.gapi.auth2.getAuthInstance();
                //this.setState({isSignedIn: this.auth.isSignedIn.get()});
                
                this.onAuthChange(this.auth.isSignedIn.get());
                this.auth.isSignedIn.listen(this.onAuthChange);
            })
        });
    }

    onSignInClick = () => {
        this.auth.signIn();
    }

    onSignOutClick = () => {  
        this.auth.signOut();
    }

    onAuthChange = (isSignedIn) => {
        //this.setState({isSignedIn: this.auth.isSignedIn.get()});
        if(isSignedIn){
            this.props.signIn(this.auth.currentUser.get().getId())
        }
        else{
            this.props.signOut();
        }
    }

    renderAuthButton(){
        if(this.props.isSignedIn === null){
            return <div>I dont know if user is signed in </div>;
        }
        else if(this.props.isSignedIn){
            return <Button variant ="info" onClick={this.onSignOutClick} >Sign Out</Button>
        }
        else{
            return <Button variant ="primary" onClick={this.onSignInClick}>Sign in with google</Button>

        }
    }

    render(){
        return <div>{this.renderAuthButton()}</div>;
    }
}

const mapStateToProps = (state) => {
    return {
        isSignedIn: state.auth.isSignedIn
    }
}

export default connect(mapStateToProps, { signIn,signOut })(GoogleAuth);
