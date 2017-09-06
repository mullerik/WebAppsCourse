import React, { Component } from 'react';
import { Tabs, Tab, Glyphicon} from 'react-bootstrap';
import SummaryTable from './SummaryTable'

class WorkoutHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            overallStats: {},
            yearStats: {},
            monthStats:{}
        };
    }

    statsType = {
        overall: 1,
        year: 2,
        month: 3
    };

    handleInputChange(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    generateStats(type){
        if (!this.props.workouts)
            return {};

        // Counters
        var stats = {
            total_workouts: 0,
            total_ex: 0,
            total_sets: 0,
            total_reps: 0,
            total_weight: 0
        };

        var workouts;
        var filterPrefix;

        switch(type) {
            case this.statsType.overall:
                workouts = this.props.workouts;
                break;
            case this.statsType.year:
                filterPrefix = (new Date()).getFullYear();
                workouts = this.props.workouts.filter(workout => workout.date.startsWith(filterPrefix));
                break;
            case this.statsType.month:
                filterPrefix = (new Date()).getFullYear();
                let month = (new Date()).getMonth() + 1;
                if (month < 10)
                    filterPrefix += '-0' + month;
                else
                    filterPrefix += '-' + month;
                workouts = this.props.workouts.filter(workout => workout.date.startsWith(filterPrefix));
                break;
            default:
                return {};
        }

        stats.total_workouts = workouts.length;
        workouts.map(workout => {
            Object.keys(workout.exercises).map(ex => {
                stats.total_ex++;
                stats.total_sets   += parseInt(workout.exercises[ex].sets, 10);
                stats.total_reps   += parseInt(workout.exercises[ex].reps, 10);
                stats.total_weight += parseInt(workout.exercises[ex].weight, 10);
                return true
            });
            return true
        });

        return stats
    }

    render(){
        return (
            <div>
                <h3>Great Job!</h3>
                <h3><Glyphicon glyph="thumbs-up" /></h3>
                <h4>Your Workout Summary</h4>
                <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                    <Tab eventKey={1} title="Overall">
                        <SummaryTable stats={this.generateStats(this.statsType.overall)}/>
                    </Tab>
                    <Tab eventKey={2} title="This Year">
                        <SummaryTable stats={this.generateStats(this.statsType.year)}/>
                    </Tab>
                    <Tab eventKey={3} title="This Month">
                        <SummaryTable stats={this.generateStats(this.statsType.month)}/>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}


export default WorkoutHistory;