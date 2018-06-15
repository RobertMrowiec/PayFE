import React, {Component} from 'react';

class Salaries extends Component {
  constructor(){
    super();
    this.state = {
      salaries: [],
    }
  }

    componentDidMount() {
      fetch('https://reactmanagebe.herokuapp.com/api/salaries')
        .then( response => response.json())
        .then( data => this.setState({salaries: data}))
    }
    
    render(){
      const {salaries} = this.state;

      return (
        <div>
          {salaries.map(salary =>
            <div key={salary.name}>
              <p> <b> Odbiorca: {salary.userId.name} </b> </p>
              <p> Projekt: {salary.projectId.name}</p> 
              <p> Kwota: {salary.value}</p>
              <p> ------------</p>
            </div>
          )}
        </div>
      )
    }
  }

export default Salaries;
