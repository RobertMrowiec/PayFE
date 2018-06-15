import React from 'react';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField'
import { InputLabel } from 'material-ui/Input';
import Snackbar from 'material-ui/Snackbar';
import Button from 'material-ui/Button';
import { Redirect } from 'react-router-dom';
import { ListItemText } from 'material-ui/List';
import { log } from 'util';

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

class AddSalaries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      isDrawerOpen: false,
      amount: '',
      title: '',
      userId:'',
      projectId: '',
      projects: [],
      users: []
    }
  }

  componentDidMount() {
    fetch('https://reactmanagebe.herokuapp.com/api/projects')
      .then( response => response.json())
      .then( projects => this.setState({projects: projects}))
      .then( () => {
        fetch('https://reactmanagebe.herokuapp.com/api/users')
          .then(response => response.json())
          .then( users => this.setState({users: users}))
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

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {

    const { redirect } = this.state

    if (redirect) {
      return (
        <Redirect to={{pathname: '/app/salaries' }}/>
      )
    }

    let changeSnackBar = () => {
      this.setState({
        open: true,
      });
      setTimeout(() => {this.setState({redirect: true})}, 1000)
    }

    let changeSnackBarToError = () => {
      this.setState({
        openError: true,
      });
    }

    let object = {
      title: this.state.title,
      amount: this.state.amount,
      userId: this.state.userId,
      projectId: this.state.projectId
    }

    let doSomething = () => {
      fetch('https://reactmanagebe.herokuapp.com/api/salaries',
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
          id="title"
          label="Temat"
          placeholder="Np. Za super pracę!"
          margin="normal"
          onChange={this.handleChange('title')}
        />
        
        <TextField
          id="amount"
          label="Kwota"
          type="number"
          InputLabelProps={{
            shrink: true
          }}
          margin="normal"
          onChange={this.handleChange('amount')}
        />


        <FormControl  style={{minWidth:166, maxWidth: 166}}>
          <InputLabel htmlFor="projects-simple"> Projekt </InputLabel>
          <Select
            value={this.state.projectId}
            onChange={this.handleChange('projectId')}
            inputProps={{
              name: 'projects',
              id: 'projects-simple',
            }}
          >
            {this.state.projects.map(proj => (
              <MenuItem key = {proj.id} value = {proj._id}>
                <ListItemText primary = {proj.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>


        <FormControl  style={{minWidth:166, maxWidth: 166}}>
          <InputLabel htmlFor="users-simple"> Odbiorca </InputLabel>
          <Select
            value={this.state.userId}
            onChange={this.handleChange('userId')}
            inputProps={{
              name: 'users',
              id: 'users-simple',
            }}
          >
            {this.state.users.map(user => (
              <MenuItem key = {user.id} value = {user._id}>
                <ListItemText primary = {user.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button raised color="primary" style={{marginLeft:'4.7%', marginTop:'10px'}} onClick={doSomething}>
            Dodaj wypłatę
          </Button>
      
          <Snackbar
            open={this.state.open}
            message="Dodano wypłatę"
            autoHideDuration={2000}
            onClose={this.handleRequestClose}
          />

          <Snackbar
            open={this.state.openError}
            message="Błąd podczas dodawania"
            autoHideDuration={2000}
            onClose={this.handleRequestClose}
          />
      </div>
    );
  }
}

export default (AddSalaries);