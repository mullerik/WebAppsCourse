import React, { Component } from 'react';
import { Button, FormGroup, FormControl, Label, ButtonGroup } from 'react-bootstrap';
import logo from './logo.png'
import ApiUtils from './ApiUtils'

class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username:'',
            password:'',
            errorMsg:'',
            msg: ''
        }
    }
    clearMsgs(respone){
        this.setState({errorMsg: '', msg: ''});
        return respone
    }

    validateFields() {
        if (this.state.username && this.state.password)
            return true;

        return false
    }

    login(){
        if (!this.validateFields())
            this.setState({errorMsg: 'Please Fill out all the fields'});
        else {
            this.clearMsgs(null);
            fetch(`/login/${this.state.username.toLowerCase()}/${this.state.password}`, {method: 'POST', credentials: 'include'})
                .then(this.clearMsgs.bind(this))
                .then(ApiUtils.checkStatus)
                .then(response => {
                    this.props.setUser(this.state.username.toLowerCase());
                    this.props.change('HomeScreen');
                })
                .catch(e => {
                    switch(e.response.status) {
                        case 403:
                            this.setState({errorMsg: `Bad credentials for ${this.state.username}. Please try again.`});
                            break;
                        case 500:
                            this.setState({errorMsg: `User ${this.state.username} doesn't exist. Please register first.`});
                            break;
                        default:
                            this.setState({errorMsg: `Unknown error occurred.`});

                    }
                })
        }

    }
    register(){
        if (!this.validateFields())
            this.setState({errorMsg: 'Please Fill out all the fields'});
        else{
            this.clearMsgs(null);
            fetch(`/register/${this.state.username.toUpperCase()}/${this.state.password}`, {method: 'POST'})
                .then(this.clearMsgs.bind(this))
                .then(ApiUtils.checkStatus)
                .then(response => this.setState({msg: `Created user ${this.state.username} successfully.`}))
                .catch(e => {
                    if (e.response.status === 500)
                        this.setState({errorMsg: `User ${this.state.username} already exists`});
                })
        }
    }
    userChange(event){
        this.setState({username: event.target.value});
    }
    passChange(event){
        this.setState({password: event.target.value});
    }
    render() {
        let LoginStyle = {
            display: ''
        };
        let credentialsStyle = {
            margin: '80px 75px'
        };
        let formStyle = {
            marginBottom: '30px'
        };
        if(this.props.show==="LoginScreen"){
            LoginStyle.display = 'inline';
        }else{
            LoginStyle.display = 'none';
        }
        return (
            <div style={LoginStyle}>
                <div style={credentialsStyle}>
                    <img src={logo} className="App-logo" alt="logo" /><br/>
                    <span>Enter username and password</span>
                    <FormGroup style={formStyle}>
                        <FormControl type="text"
                                     placeholder="User"
                                     value={this.state.username}
                                     onChange={this.userChange.bind(this)}/>
                        <FormControl type="password"
                                     placeholder="Password"
                                     value={this.state.password}
                                     onChange={this.passChange.bind(this)}/>
                    <h5><Label bsStyle="success">{this.state.msg}</Label></h5>
                    <h5><Label bsStyle="danger">{this.state.errorMsg}</Label></h5>
                    </FormGroup>
                    <ButtonGroup>
                    <Button bsStyle="primary" onClick={this.register.bind(this)}>Register</Button>
                    <Button bsStyle="success" onClick={this.login.bind(this)}>Login</Button>
                    </ButtonGroup>
                    <br/>
                </div>
            </div>
        );
    }
}

export default LoginScreen;



















