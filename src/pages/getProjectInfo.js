import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { Redirect } from 'react-router-dom';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
const style = {
  typo: {
    'marginLeft': '30%',
    'marginTop': '20%'
  }
}

class GetProjectInfo extends Component {
  constructor(props) {
      super(props);
      this.state = {
          users: [],
          salaries: []
      }
  }

  componentDidMount() {
    fetch('https://reactmanagebe.herokuapp.com/api/dashboards/projects/' + this.props.match.params.id, {credentials: 'include'})
      .then( response => response.json())
      .then( data => {
          this.setState({users: data.users, salaries: data.salary, allSalaries: data.allSalaries})
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
    
    let data = {
      labels: this.state.users,
      datasets: [
        {
          label: "Aktualne Zarobki z tego projektu",
          data: this.state.salaries,
          backgroundColor: 'rgba(103,220,114, 0.2)',
          borderColor: 'rgba(103,220,114, 0.2)'
        },
        {
          label: "Potencjalne z tego projektu",
          data: this.state.allSalaries
        }
      ]
    }
  
    return (
      <div style={{marginTop:'-5%', marginLeft: '162px', marginRight: '40px'}}>
        <Line data={data} height={170} />
      </div>
    )
  }
}

export default GetProjectInfo;
