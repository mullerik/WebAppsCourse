import React, { Component } from 'react';
import ApiUtils from './ApiUtils'

class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username:'admin',
            password:'admin',
            errorMsg:''
        }
    }
    login(){
        fetch(`/login/${this.state.username}/${this.state.password}`, {method: 'POST', credentials: 'include'})
            .then(ApiUtils.checkStatus)
            .then(response => {
                console.log(response);
                this.props.change('HomeScreen')
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
    register(){
        fetch(`/register/${this.state.username}/${this.state.password}`, {method: 'POST'})
            .then(ApiUtils.checkStatus)
            .then(response => console.log(response))
            .catch(e => {
                if (e.response.status === 500)
                    this.setState({errorMsg: `User ${this.state.username} already exists`});
            })
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
        if(this.props.show==="LoginScreen"){
            LoginStyle.display = 'inline';
        }else{
            LoginStyle.display = 'none';
        }
        return (
            <div style={LoginStyle}>
                <h1>FiTotal</h1>
                User: <input value={this.state.username}
                             onChange={this.userChange.bind(this)}></input>

                Pass: <input value={this.state.password}
                             type="password"
                             onChange={this.passChange.bind(this)}></input>
                <button onClick={this.register.bind(this)}>Register</button>
                <button onClick={this.login.bind(this)}>Login</button>
                <br/>
                <span>{this.state.errorMsg}</span>
            </div>
        );
    }
}

export default LoginScreen;



















