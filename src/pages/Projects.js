import React, {Component} from 'react';

class Projects extends Component {
  constructor(){
    super();
    this.state = {
      projects: [],
    }
  }

    componentDidMount() {
      fetch('https://reactmanagebe.herokuapp.com/api/projects')
        .then( response => response.json())
        .then( data => this.setState({projects: data}))
    }
    
    render(){
      const {projects} = this.state;
      return (
        <div>
          {projects.map(project =>
            <div key={project.name}>
              <p> <b> Nazwa: {project.name} </b> </p>
              <div key={project.peoples}>
                <p> Ile osób pracuje: {project.peoples}</p>
              </div>
              <div key={project.amount}>
                <p> Kwota: {project.amount}</p>
              </div>
              <div key={project.howmany}>
                <p> Ile pozostało: {project.howmany}</p>
              </div>
              <div key={project.salaries}>
                <p> Ilość wypłat: {project.salaries}</p>
              </div>
              <div>
                <p> ------------</p>
              </div>
            </div>
          )}
        </div>
      )
    }
  }

export default Projects;
