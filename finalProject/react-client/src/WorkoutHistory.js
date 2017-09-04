/**
 * Created by arik_ on 9/4/2017.
 */
import React, { Component } from 'react';
import ApiUtils from './ApiUtils'
import { Button, Glyphicon, Panel, Badge, FormGroup, FormControl, ListGroup, ListGroupItem} from 'react-bootstrap';
import ShareModal from "./ShareModal";
import ExerciseModal from "./ExerciseModal";

class WorkoutHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterTitle: ''
        };
    }

    handleInputChange(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    deleteWorkout(id){
        fetch(`/deleteWorkout/${id}`, {method: 'DELETE', credentials: 'include'})
            .then(ApiUtils.checkStatus)
            .catch(e => console.log(e));
            this.props.refreshWorkouts();
    }

    deleteExercise(workout, id){
        fetch(`/deleteExercise/${workout.id}/${id}`, {method: 'DELETE', credentials: 'include'})
            .then(ApiUtils.checkStatus)
            .catch(e => console.log(e));
        this.props.refreshWorkouts();
    }

    getFilteredWorkouts(){
        if (!this.state.filterTitle)
            return this.props.workouts;

        return this.props.workouts.filter(workout => workout.title.toLowerCase().includes(this.state.filterTitle.toLowerCase()))
    }

    render(){
        let PanelStyle ={
            textAlign: "left"
        };
        let ActionsStyle = {
            fontSize: "12px",
            fontWeight: "bold"
        };
        let RemoveButton ={
            fontSize: "12px",
            marginRight: "5px",
            borderRadius: "20px"

        };
        if (!this.props.workouts){
            return (
                <div>
                    No workouts found
                </div>
            );
        }
        else {
            var filteredList = this.getFilteredWorkouts();
            return (
                <div>
                    <p style={PanelStyle}>Last Workouts - <Badge>{this.props.workouts.length}</Badge></p>
                    <FormGroup>
                        <FormControl type="text"
                                     placeholder="Filter by title"
                                     name="filterTitle"
                                     value={this.state.filterTitle}
                                     onChange={this.handleInputChange.bind(this)}/>
                    </FormGroup>
                    {filteredList.map(workout => {
                        var title = `${workout.title} - ${workout.date}`;
                        return (
                            <Panel bsStyle="info" style={PanelStyle} key={workout.id} header={title}>
                                <ListGroup fill>
                                    <div style={ActionsStyle}>
                                    <ExerciseModal user={this.props.user}
                                                   workout={workout}
                                                   exercises={this.props.exercises}
                                                   refreshWorkouts={this.props.refreshWorkouts}
                                                   refreshSharedWorkouts={this.props.refreshSharedWorkouts}/>
                                    <span>New Exercise </span>
                                    </div>
                                    {Object.keys(workout.exercises).map(id => {
                                        return (
                                            <ListGroupItem key={id}>
                                                <Button style={RemoveButton} bsSize="xs" bsStyle="danger"
                                                        onClick={this.deleteExercise.bind(this, workout, id)}>
                                                    <Glyphicon glyph="remove"/>
                                                </Button>
                                                <span>
                                                    {workout.exercises[id].ex_name} - {workout.exercises[id].sets}/{workout.exercises[id].reps}/{workout.exercises[id].weight}
                                                </span>
                                            </ListGroupItem>
                                        )
                                    })}
                                </ListGroup>
                                <div>Goals: {workout.goals}</div><hr/>
                                <div>
                                    <div>
                                        <span>Share your workout </span>
                                        <ShareModal user={this.props.user}
                                                    workout={workout}
                                                    refreshSharedWorkouts={this.props.refreshSharedWorkouts} />
                                        <span> or delete it </span>
                                        <Button bsSize="xs" bsStyle="danger"
                                                onClick={this.deleteWorkout.bind(this, workout.id)}><Glyphicon glyph="remove" /></Button>
                                    </div>
                                </div>
                            </Panel>
                        )
                    })}
                </div>
            );
        }
    }
}


export default WorkoutHistory;