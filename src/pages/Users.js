import React, { Component } from 'react';

class Users extends Component {
  constructor(){
    super();
    this.state = {
      users: []
    }
  }

    componentDidMount() {
      fetch('https://reactmanagebe.herokuapp.com/api/users')
        .then( response => response.json())
        .then( data => this.setState({users: data}))
    }
    
    render(){
      const {users} = this.state;
      return (
        <div>
          {users.map(user =>
            <div key={user.name}>
              <p> {user.name} </p>
              <p> {user.surname}</p>
              <p> ------------</p>
            </div>
          )}
        </div>
      )
    }
  }

export default Users;
