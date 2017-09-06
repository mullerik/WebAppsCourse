import React, { Component } from 'react';
import { Table} from 'react-bootstrap';

class WorkoutHistory extends Component {
    render(){
        let AlignLeftStyle = {
          textAlign: "left"
        };
        if (!this.props.stats.total_workouts)
            return (
                <div>
                    <Table responsive striped>
                        <thead>
                        <tr>
                            <th>No relevant workouts found</th>
                        </tr>
                        </thead>
                    </Table>
                </div>
            );
        else {
            return (
                <div>
                    <Table responsive striped bordered style={AlignLeftStyle}>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Total #</th>
                        </tr>
                    </thead>
                        <tbody>
                        <tr>
                            <td>Workouts</td>
                            <td>{this.props.stats.total_workouts}</td>
                        </tr>
                        <tr>
                            <td>Exercises</td>
                            <td>{this.props.stats.total_ex}</td>
                        </tr>
                        <tr>
                            <td>Sets</td>
                            <td>{this.props.stats.total_sets}</td>
                        </tr>
                        <tr>
                            <td>Reps</td>
                            <td>{this.props.stats.total_reps}</td>
                        </tr>
                        <tr>
                            <td>Weight</td>
                            <td>{this.props.stats.total_weight} Kgs</td>
                        </tr>
                        </tbody>
                    </Table>
                </div>
            );
        }
    }
}


export default WorkoutHistory;