import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { Redirect } from 'react-router-dom';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { ListItem, ListItemText } from 'material-ui/List';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'; 

import GetProjects from './getProjects';
import AddProjects from './AddProjects';
import EditProjects from './EditProjects';
import GetUsers from './getUsers';
import GetUserInfo from './getUserInfo';
import AddUsers from './AddUsers';
import EditUsers from './EditUsers';
import Login from './Login';
import GetSalaries from './getSalaries';
import AddSalaries from './AddSalaries';
import EditSalaries from './EditSalaries';
import Button from 'material-ui/Button';

const styles = theme => ({
  typo: {
    'marginLeft': '30%',
    'marginTop': '20%'
  },
  root: {
    marginLeft: '8%',
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    // position: 'relative',
    display: 'flex',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  button: {
    color: 'white',
    size: 'large',
    margin: theme.spacing.unit,
  },
  buttonLogout: {
    color: 'white',
    size: 'large',
    marginLeft: '86%',
  },
  drawer: {
    position: 'relative',
    marginTop: '5%',
  },
  toolbar: theme.mixins.toolbar
})

class Home extends Component {
  constructor(props) {
      super(props);
      this.state = {
          users: [],
          salaries: []
      }
  }

  componentDidMount() {
    fetch('https://reactmanagebe.herokuapp.com/api/dashboards/salaries', {credentials: 'include'})
      .then( response => response.json())
      .then( data => {
        if (!data.imiona){
          return this.setState({sum: data.sum, sumData: true})
        }
        else {
          return this.setState({users: data.imiona, potentiallySalaries: data.potencjalne, salaries: data.sumy, sumData: false})
        }
      })
      .then(() => this.setState({isLoading: false}))
      .catch(err => {
        if (err == 'TypeError: Failed to fetch') return this.setState({redirectLogin: true})
      })
  }

  render(){
    const { redirectLogin } = this.state
    const { isLoading } = this.state
    const { sumData } = this.state
    const { classes } = this.props

    if (isLoading) {
      return <CircularProgress style={{
        'width': '60px',
        'height': '40px',
        'margin-left': '44%',
        'margin-top': '24%'
      }}/>
    }

    if (redirectLogin) {
      return (
        <Redirect to={{pathname: '/login' }}/>
      )
    } 
    
    if (sumData){
      return (
        <div style={{textAlign:'center', marginTop:'15%'}}>
          <Typography variant = 'display2' className={styles.typo}> W tym miesiącu zarobiłeś: {this.state.sum.toFixed(2)} zł
            {/* <Typography> * Proponuje tutaj tez zrobic wykres tylko z podziałem na projekty (estimate time = 6 hours) </Typography> */}
          </Typography>
        </div>
      )
    }
    else {      
      let data = {
        labels: this.state.users,
        datasets: [{
          label: "Zarobki z tego miesiąca",
          data: this.state.salaries,
          backgroundColor: 'rgba(103,220,114, 0.2)',
          borderColor: 'rgba(103,220,114, 0.2)',
        },
        {
          label: "Potencjalne zarobki z tego miesiąca",
          data: this.state.potentiallySalaries,
        }]
      }

      return (
        <div style={{marginLeft: '8%', marginTop: '-5%', width:'90%'}}>
            <Line data={data} height={170}/>
        </div>
      )
    }
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Home)
