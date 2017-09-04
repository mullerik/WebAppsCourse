/**
 * Created by arik_ on 9/4/2017.
 */
import React, { Component } from 'react';
import {Panel, Badge, FormGroup, FormControl, ListGroup, ListGroupItem} from 'react-bootstrap';

class SharedWorkoutHistory extends Component {
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

    getFilteredWorkouts(){
        if (!this.state.filterTitle)
            return this.props.workouts;

        return this.props.workouts.filter(workout => workout.title.toLowerCase().includes(this.state.filterTitle.toLowerCase()))
    }

    render(){
        let AlignLeft = {
            textAlign: "left"
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
                    <p style={AlignLeft}>Friends Last Workouts - <Badge>{this.props.workouts.length}</Badge></p>
                    <FormGroup>
                        <FormControl type="text"
                                     placeholder="Filter by title"
                                     name="filterTitle"
                                     value={this.state.filterTitle}
                                     onChange={this.handleInputChange.bind(this)}/>
                    </FormGroup>
                    {filteredList.map(workout => {
                        var title = `${workout.title} - ${workout.date} (${workout.user})`;
                        return (
                            <Panel bsStyle="info" style={AlignLeft} key={workout.id} header={title}>
                                <ListGroup fill>
                                    {Object.keys(workout.exercises).map(id => {
                                        return (
                                            <ListGroupItem key={id}>
                                                <span>
                                                    {workout.exercises[id].ex_name} - {workout.exercises[id].sets}/{workout.exercises[id].reps}/{workout.exercises[id].weight}
                                                </span>
                                            </ListGroupItem>
                                        )
                                    })}
                                </ListGroup>
                                <div>Goals: {workout.goals}</div>
                            </Panel>
                        )
                    })}
                </div>
            );
        }
    }
}

export default SharedWorkoutHistory;