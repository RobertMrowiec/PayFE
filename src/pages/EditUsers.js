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
    width: '15%',
    padding: '10px'
  },
  customWidth: {
    margin: 'auto',
    width: '100%'
  }
};

const tab = ['asd']

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
    fetch('https://reactmanagebe.herokuapp.com/api/users/' + this.props.match.params.id)
      .then( response => response.json())
      .then( data => this.setState({
        name: data.name,
        surname: data.surname,
        email: data.email,
        projects: data.projects
      }))
      .then(() => {
        fetch('https://reactmanagebe.herokuapp.com/api/projects')
          .then( response => response.json())
          .then( projectData => this.setState({values: projectData}))
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
    // if (event.target.value != this.state.projects) {
      console.log(event.target.value)
      console.log(this.state.projects)
      
      this.setState({ projects: event.target.value });
    // }
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {

    const { redirect } = this.state

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
      projects: this.state.projects
    }
    let Edit = () => {
      console.log(object);
      fetch('https://reactmanagebe.herokuapp.com/api/users/' + this.props.match.params.id,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "PUT",
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
      console.log(object);
      fetch('https://reactmanagebe.herokuapp.com/api/users',
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "POST",
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
          label="Imie"
          placeholder={this.state.name}
          margin="normal"
          onChange={this.handleChange('name')}
        />

        <TextField
          id="surname"
          label="Nazwisko"
          placeholder={this.state.surname}
          margin="normal"
          onChange={this.handleChange('surname')}
        />

        <TextField
          id="email"
          label="Email"
          placeholder={this.state.email}
          margin="normal"
          onChange={this.handleChange('email')}
        />

        <FormControl style={styles.formControl}>

        <InputLabel htmlFor="name-multiple">Projekty</InputLabel>
          <Select
            multiple
            value={this.state.projects}
            onChange={this.handleProjectChange}
            input={<Input id="name-multiple"/>}
            style={{maxWidth:"200px", minWidth: "200px"}}
          >
            {this.state.values.map(value => (
              <MenuItem
                key={value.name}
                value={value._id}
              >
                {value.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
          
          <Button raised color="primary" style={{marginLeft:'unset', marginTop:'10px'}} onClick={Cancel}>
            Cofnij
          </Button>
          <Button raised color="primary" style={{marginLeft:'4.7%', marginTop:'10px'}} onClick={Edit}>
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