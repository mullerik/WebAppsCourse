import React, { Component } from 'react';
import './App.css';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {show:'LoginScreen'};

    }
    changeScreen(newScreen){
        this.setState({show:newScreen});
    }
    render() {
        return (
            <div className="App">
                <LoginScreen show={this.state.show} change={this.changeScreen.bind(this)}/>
                <HomeScreen show={this.state.show} change={this.changeScreen.bind(this)}/>
            </div>
        );
    }
}

export default App;
