import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { Redirect } from 'react-router-dom';
import { CircularProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
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
    
    let Cancel = () => this.setState({redirect: true})

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
      <div style={{marginTop: '-90px'}}>
        <Button color="primary" style={{marginRight:'1.3%', float:'right'}} onClick={Cancel}>
          Cofnij
        </Button>

        <div >
          <Line data={data} />
      </div>
      </div>
    )
  }
}

export default GetProjectInfo;
