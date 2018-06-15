import React from 'react';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField'
import Input, { InputLabel } from 'material-ui/Input';
import Snackbar from 'material-ui/Snackbar';
import Button from 'material-ui/Button';
import { Redirect } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    minWidth: 120,
    maxWidth: 300,
  },
  button : {
    margin: 30
  },
  div: {
    margin: 'auto',
    width: '11%',
    marginTop: '-6%'
  },
  customWidth: {
    margin: 'auto',
    width: '100%'
  }
};

class EditUser extends React.Component {
  constructor(props) {
    super(props);
      this.state = {    
        open: false,
        isDrawerOpen: false,
        name:'',
        surname:'',
        email:'',
        projects: [],
        values: []
      };
  }

  componentDidMount() {
    fetch('https://reactmanagebe.herokuapp.com/api/users/' + this.props.match.params.id, {credentials: 'include'})
      .then( response => response.json())
      .then( data => this.setState({
        name: data.name,
        surname: data.surname,
        email: data.email,
        projects: data.projects
      }))
      .then(() => {
        fetch('https://reactmanagebe.herokuapp.com/api/projects', {credentials: 'include'})
          .then( response => response.json())
          .then( projectData => this.setState({values: projectData.projects}))
      })
      .catch(err => {
        if (err == 'TypeError: Failed to fetch') return this.setState({redirectLogin: true})
      })
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  handleClick = () => {
    this.setState({
      open: true,
    });
  };

  handleProjectChange = event => {
    this.setState({ projects: event.target.value });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {

    const { redirect } = this.state
    const { redirectLogin } = this.state

    if (redirectLogin) {
      return (
        <Redirect to={{pathname: '/login' }}/>
      )
    }
    if (redirect) {
      return (
        <Redirect to={{pathname: '/app/users' }}/>
      )
    }

    let changeSnackBar = () => {
      this.setState({
        open: true,
      });
      setTimeout(() => {this.setState({redirect: true})} ,1000)
    }

    let changeSnackBarToError = () => {
      this.setState({
        openError: true,
      });
    }

    let object = {
      name: this.state.name,
      surname: this.state.surname,
      email: this.state.email,
      password: this.state.password,
      projects: this.state.projects
    }
    let Edit = () => {
      fetch('https://reactmanagebe.herokuapp.com/api/users/' + this.props.match.params.id,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "PUT",
          credentials: 'include',
          body: JSON.stringify(object)
        }
      ).then(response => {
        if (!response.ok){
          throw Error(response.statusText)
        }
        return response
      }).then(changeSnackBar)
        .catch(changeSnackBarToError)
    }
    
    let Cancel = () => {
      {this.setState({redirect: true})}
    }
    
    let doSomething = () => {
      fetch('https://reactmanagebe.herokuapp.com/api/users',
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "POST",
          credentials: 'include',
          body: JSON.stringify(object)
        }
      ).then(response => {
        if (!response.ok){
          throw Error(response.statusText)
        }
        return response
      }).then(changeSnackBar)
        .catch(changeSnackBarToError)
    }
    return (
      <div style={styles.div}>

        <TextField
          id="name"
          label={this.state.name}
          placeholder="Imie"
          margin="normal"
          onChange={this.handleChange('name')}
        />

        <TextField
          id="surname"
          label={this.state.surname}
          placeholder="Nazwisko"
          margin="normal"
          onChange={this.handleChange('surname')}
        />

        <TextField
          id="email"
          label={this.state.email}
          placeholder="Email"
          margin="normal"
          onChange={this.handleChange('email')}
        />

        <TextField
          id="password"
          label="Hasło"
          type="password"
          margin="normal"
          onChange={this.handleChange('password')}
        />

        <br />
        <Button color="primary" style={{marginLeft:'unset', marginTop:'10px'}} onClick={Cancel}>
          Cofnij
        </Button>
        <Button color="primary" style={{marginLeft:'4.7%', marginTop:'10px'}} onClick={Edit}>
          Edytuj
        </Button>

        <Snackbar
          open={this.state.open}
          message="Edytowano uzytkownika"
          autoHideDuration={2000}
          onClose={this.handleRequestClose}
        />

        <Snackbar
          open={this.state.openError}
          message="Bląd podczas edycji"
          autoHideDuration={2000}
          onClose={this.handleRequestClose}
        />

      </div>
    )
  }
}

export default EditUser;