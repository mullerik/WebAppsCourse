import React, { Component } from 'react';
import ApiUtils from './ApiUtils'
import { Button, Glyphicon, Modal, FormGroup, FormControl, Label} from 'react-bootstrap';

class ShareModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCreateModal: false,
            userToShare: ''
        }
    }
    showWorkoutModal() {
        this.setState({showCreateModal: true});
    }

    closeWorkoutModal() {
        this.setState({showCreateModal: false});
    }
    validateFields() {
        if (this.state.userToShare)
            return true;

        return false
    }

    shareWorkout(){
        if (!this.validateFields())
            this.setState({errorMsg: 'Please Fill out all the fields'});
        else {
            this.setState({errorMsg: ''});
            fetch(`/shareWorkout/`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        workout_id: this.props.workout.id,
                        owner: this.props.user,
                        userToShare: this.state.userToShare,
                    })
                })
                .then(ApiUtils.checkStatus)
                .then(()=> {
                    this.props.refreshSharedWorkouts();
                    this.setState({
                        showCreateModal: false,
                        userToShare: ''
                    })
                })
                .catch(e => {
                        if (e.response.status === 404)
                            this.setState({errorMsg: `Username ${this.state.userToShare} doesn't exist.`});
                });
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
            margin: "5px"
        };
        return (
            <span>
                <Button style={ButtonStyle} bsSize="xs" bsStyle="success"
                        onClick={this.showWorkoutModal.bind(this)}><Glyphicon glyph="share" /></Button>
                <Modal show={this.state.showCreateModal} onHide={this.closeWorkoutModal.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Share your workout</Modal.Title>
                        <span>Want others to see your workout?</span>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <FormGroup>
                                <FormControl type="text"
                                             placeholder="Enter a username"
                                             name="userToShare"
                                             value={this.state.userToShare}
                                             onChange={this.handleInputChange.bind(this)}/>
                            </FormGroup>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <h5><Label bsStyle="danger">{this.state.errorMsg}</Label></h5>
                        <Button bsStyle="success"
                                onClick={this.shareWorkout.bind(this)}>
                            Share!
                        </Button>
                        <Button onClick={this.closeWorkoutModal.bind(this)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </span>
        );
    }
}

export default ShareModal;