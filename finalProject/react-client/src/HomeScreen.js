import React, { Component } from 'react';
import ApiUtils from './ApiUtils'

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username:'admin',
            password:'admin',
            errorMsg:''
        }
    }

    logout() {
        fetch(`/logout/`, {method: 'POST', credentials: 'include'})
            .then(ApiUtils.checkStatus)
            .then(response => {
                console.log(response);
                this.props.change('LoginScreen');
            })
            .catch(e => {
                if (e.response.status === 500)
                    this.setState({errorMsg: `User ${this.state.username} already logged out.`});
            })
    }

    render() {
        let HomeStyle = {
            display: ''
        };
        if(this.props.show==="HomeScreen"){
            HomeStyle.display = 'inline';
        }else{
            HomeStyle.display = 'none';
        }
        return (
            <div style={HomeStyle}>
                <h1>In Home</h1>
                <button onClick={this.logout.bind(this)}>Logout</button>
            </div>
        );
    }
}

export default HomeScreen;
