import React, { Component } from 'react';
import ApiUtils from './ApiUtils'
import { Button, Glyphicon, Modal, FormGroup, FormControl, Label, ControlLabel} from 'react-bootstrap';

class ExerciseModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCreateModal: false,
            errorMsg: '',
            ex: 0,
            sets: '',
            reps: '',
            weight: ''
        }
    }
    showWorkoutModal() {
        this.setState({showCreateModal: true});
    }

    closeWorkoutModal() {
        this.setState({showCreateModal: false});
    }
    validateFields() {
        if (this.state.sets && this.state.reps && this.state.weight)
            return true;

        return false
    }
    addExercise(){
        if (!this.validateFields())
            this.setState({errorMsg: 'Please Fill out all the fields'});
        else {
            this.setState({errorMsg: ''});
            fetch(`/addExercise/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    workout_id: this.props.workout.id,
                    ex_id: this.state.ex,
                    sets: this.state.sets,
                    reps: this.state.reps,
                    weight: this.state.weight
                })
            })
                .then(ApiUtils.checkStatus)
                .then(()=> {
                    this.props.refreshWorkouts();
                    this.props.refreshSharedWorkouts();
                    this.setState({
                        showCreateModal: false,
                        errorMsg: '',
                        ex: 0,
                        sets: '',
                        reps: '',
                        weight: ''
                    })
                })
                .catch(e => console.log(e));
        }
    }


    handleInputChange(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }


    render() {
        let ButtonStyle = {
            margin: "5px",
            borderRadius: "30px",
            marginLeft: "15px"
        };
        if (this.props.exercises){
            return (
                <span>
                    <Button style={ButtonStyle} bsSize="xs" bsStyle="success"
                            onClick={this.showWorkoutModal.bind(this)}><Glyphicon glyph="plus" /></Button>
                    <Modal show={this.state.showCreateModal} onHide={this.closeWorkoutModal.bind(this)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add an exercise</Modal.Title>
                            <span>Choose the right exercise for you</span>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <FormGroup controlId="formControlsSelectPart">
                                    <ControlLabel>Exercise</ControlLabel>
                                    <FormControl componentClass="select"
                                                 placeholder="select"
                                                 value={this.state.ex}
                                                 name="ex"
                                                 onChange={this.handleInputChange.bind(this)}>
                                    {Object.keys(this.props.exercises).map(id =>{
                                            return <option key={id}
                                                           value={id}>{this.props.exercises[id]}</option>
                                    })}
                                    </FormControl>
                                </FormGroup>
                                <FormGroup controlId="formInline">
                                    <ControlLabel>Sets</ControlLabel>
                                    {' '}
                                    <FormControl type="number" placeholder="3"
                                                 value={this.state.sets}
                                                 name="sets"
                                                 onChange={this.handleInputChange.bind(this)}/>
                                </FormGroup>
                                {' '}
                                <FormGroup controlId="formInline">
                                    <ControlLabel>Reps</ControlLabel>
                                    {' '}
                                    <FormControl type="number" placeholder="10"
                                                 value={this.state.reps}
                                                 name="reps"
                                                 onChange={this.handleInputChange.bind(this)}/>
                                </FormGroup>
                                <FormGroup controlId="formInline">
                                    <ControlLabel>Weight</ControlLabel>
                                    {' '}
                                    <FormControl type="number" placeholder="50"
                                                 value={this.state.weight}
                                                 name="weight"
                                                 onChange={this.handleInputChange.bind(this)}/>
                                </FormGroup>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <h5><Label bsStyle="danger">{this.state.errorMsg}</Label></h5>
                            <Button bsStyle="success"
                                    onClick={this.addExercise.bind(this)}>
                                Add!
                            </Button>
                            <Button onClick={this.closeWorkoutModal.bind(this)}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </span>
            );
        }
        else
            return <div></div>
    }
}

export default ExerciseModal;