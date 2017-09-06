import React, { Component } from 'react';
import './App.css';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show:'LoginScreen',
            loggedUser: ''
        };

    }
    setUser(user) {
        this.setState({loggedUser:user});
    }
    changeScreen(newScreen){
        this.setState({show:newScreen});
    }
    render() {
        if (this.state.loggedUser){
            return (
                <div className="App">
                    <LoginScreen show={this.state.show}
                                 setUser={this.setUser.bind(this)}
                                 change={this.changeScreen.bind(this)}/>
                    <HomeScreen show={this.state.show}
                                user={this.state.loggedUser.toLowerCase()}
                                setUser={this.setUser.bind(this)}
                                change={this.changeScreen.bind(this)}/>
                </div>
            );
        }
        else {
            return (
                <div className="App">
                    <LoginScreen show={this.state.show}
                                 setUser={this.setUser.bind(this)}
                                 change={this.changeScreen.bind(this)}/>
                </div>
            );
        }
    }
}

export default App;
