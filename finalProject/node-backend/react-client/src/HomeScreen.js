import React, { Component } from 'react';
import logo from './logo.png'
import ApiUtils from './ApiUtils'
import CreateWorkoutModal from './CreateWorkoutModal'
import WorkoutHistory from './WorkoutHistory'
import SharedWorkoutHistory from './SharedWorkoutHistory'
import SummaryPanel from './SummaryPanel'
import { Button, PanelGroup, Panel, PageHeader, Label, Alert } from 'react-bootstrap';

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMsg: '',
            showCreateModal: false,
            workouts: [],
            sharedWorkouts: [],
            exercises: {}
        }
    }

    componentDidMount() {
        this.refreshWorkouts();
        this.refreshSharedWorkouts();
        this.getExercises()
    }

    getExercises(){
        fetch(`/getExercises/`, {method: 'GET', credentials: 'include'})
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .then(response => this.setState({exercises: response}))
            .catch(e => console.log(e));
    }

    refreshWorkouts(){
        fetch(`/getWorkouts/${this.props.user}`, {method: 'GET', credentials: 'include'})
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .then(response => this.setState({workouts: response}))
            .catch(e => console.log(e));
    }
    refreshSharedWorkouts(){
        fetch(`/getSharedWorkouts/${this.props.user}`, {method: 'GET', credentials: 'include'})
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .then(response => this.setState({sharedWorkouts: response}))
            .catch(e => console.log(e));
    }

    logout() {
        fetch(`/logout/`, {method: 'POST', credentials: 'include'})
            .then(ApiUtils.checkStatus)
            .then(res => {
                this.props.change('LoginScreen');
                this.props.setUser('');
            })
            .catch(e => {
                if (e.response.status === 500)
                    this.setState({errorMsg: `User ${this.props.user} already logged out.`});
            })
    }

    delete() {
        fetch(`/deleteAccount/${this.props.user}`, {method: 'DELETE', credentials: 'include'})
            .then(ApiUtils.checkStatus)
            .then(res => {
                this.props.change('LoginScreen');
                this.props.setUser('');
            })
            .catch(e => {
                if (e.response.status === 500)
                    this.setState({errorMsg: `User ${this.props.user} doesn't exist.`});
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
        let panelGroupStyle = {
            margin: '20px'
        };
        // Render only if logged in user exists
        if (this.props.user) {
            return (
                <div style={HomeStyle}>
                    <PageHeader>
                    </PageHeader>
                    <img src={logo} className="App-logo" alt="logo" /><br/>
                    <small className="Subtitle">Your personal training App</small><br/>
                    <PanelGroup activeKey={this.state.activeKey}
                                onSelect={this.handleSelect}
                                accordion
                                style={panelGroupStyle}>
                        <Alert bsStyle="info">
                            <h4><strong>Ahoy! {this.props.user}</strong></h4>
                        <h5>Start your FiTotal experience by creating a new workout</h5>
                        <CreateWorkoutModal user={this.props.user}
                                            refreshWorkouts={this.refreshWorkouts.bind(this)}/>
                        </Alert>
                        <Panel header="Your Workouts" eventKey="1">
                            <WorkoutHistory user={this.props.user}
                                            workouts={this.state.workouts}
                                            exercises={this.state.exercises}
                                            refreshWorkouts={this.refreshWorkouts.bind(this)}
                                            refreshSharedWorkouts={this.refreshSharedWorkouts.bind(this)}/>
                        </Panel>
                        <Panel header="Follow Your Friends" eventKey="2">
                            <SharedWorkoutHistory user={this.props.user}
                                                  workouts={this.state.sharedWorkouts}/>
                        </Panel>
                        <Panel header="Summary" eventKey="3">
                            <SummaryPanel user={this.props.user}
                                          workouts={this.state.workouts}/>
                        </Panel>
                    </PanelGroup>
                    <Button bsStyle="link" onClick={this.logout.bind(this)}>Logout</Button><br/>
                    <Button bsStyle="link" onClick={this.delete.bind(this)}>Delete Account</Button><br/>
                    <Label>Caution: This cannot be undone!</Label>
                </div>
            );
        }
        else
            return <div></div>
    }
}

export default HomeScreen;
