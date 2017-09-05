import React, { Component } from 'react';
import ApiUtils from './ApiUtils'
import { Button, Glyphicon, Modal, FormGroup, FormControl, ControlLabel, HelpBlock, Label} from 'react-bootstrap';

// Wrapper for input
function FieldGroup({ id, label, help, ...props }) {
    return (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl type="input" {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}

class CreateWorkoutModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCreateModal: false,
            errorMsg: '',
            title: '',
            date: '',
            goals: ''
        }
    }
    showWorkoutModal() {
        this.setState({showCreateModal: true});
    }

    closeWorkoutModal() {
        this.setState({showCreateModal: false});
    }

    validateFields() {
        if (this.state.title && this.state.date && this.state.goals)
            return true;

        return false
    }

    handleInputChange(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }


    submitWorkout() {
        if (!this.validateFields())
            this.setState({errorMsg: 'Please Fill out all the fields'});
        else {
            this.setState({errorMsg: ''});
            fetch(`/createWorkout/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: this.state.title,
                    date: this.state.date,
                    goals: this.state.goals,
                    user: this.props.user
                })
            })
            .then(ApiUtils.checkStatus)
            .catch(e => console.log(e));
            this.props.refreshWorkouts();
            this.setState({
                showCreateModal: false,
                errorMsg: '',
                title: '',
                date: '',
                goals: ''
            });
        }
    }

    render() {
        return (
            <div>
                <Button bsSize="small" bsStyle="success" onClick={this.showWorkoutModal.bind(this)}>
                    <Glyphicon glyph="plus" />
                </Button>
                <Modal show={this.state.showCreateModal} onHide={this.closeWorkoutModal.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create a new Workout</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ul>
                        </ul>
                        <form>
                            <FieldGroup
                                id="formControlsText"
                                type="text"
                                label="Text"
                                placeholder="Title"
                                name="title"
                                value={this.state.title}
                                onChange={this.handleInputChange.bind(this)}
                            />
                            <FieldGroup
                                id="formControlsDate"
                                label="Creation Date"
                                type="date"
                                name="date"
                                value={this.state.date}
                                onChange={this.handleInputChange.bind(this)}
                            />
                            <FormGroup controlId="formControlsTextarea">
                                <ControlLabel>Your Goals</ControlLabel>
                                <FormControl componentClass="textarea"
                                             placeholder="Write here your workout goals"
                                             name="goals"
                                             value={this.state.goals}
                                             onChange={this.handleInputChange.bind(this)}/>
                            </FormGroup>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <h5><Label bsStyle="danger">{this.state.errorMsg}</Label></h5>
                        <Button bsStyle="primary"
                                onClick={this.submitWorkout.bind(this)}>
                            Create
                        </Button>
                        <Button onClick={this.closeWorkoutModal.bind(this)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default CreateWorkoutModal;