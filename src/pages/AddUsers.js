import React from 'react';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField'
import Input, { InputLabel } from 'material-ui/Input';
import Snackbar from 'material-ui/Snackbar';
import Button from 'material-ui/Button';
import { Redirect } from 'react-router-dom';
import Checkbox from 'material-ui/Checkbox';
import { ListItemText } from 'material-ui/List';

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
    padding: '10px',
    marginTop:'-6%'
  },
  customWidth: {
    margin: 'auto',
    width: '100%'
  }
};

class AddUser extends React.Component {
  constructor(props) {
    super(props);
      this.state = {    
        open: false,
        isDrawerOpen: false,
        name:'',
        surname:'',
        email:'',
        values: [],
        tag: new Set()
      };
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
      setTimeout(() => {this.setState({redirect: true})}, 1000)
    }

    let changeSnackBarToError = () => {
      this.setState({
        openError: true,
      });
    }

    let changeSnackBarName = () => {
      this.setState({
        openName: true,
      });
    }

    let changeSnackBarSurname = () => {
      this.setState({
        openSurname: true,
      });
    }

    let changeSnackBarPassword = () => {
      this.setState({
        openPassword: true,
      });
    }


    let changeSnackBarEmail = () => {
      this.setState({
        openEmail: true,
      });
    }

    let object = {
      name: this.state.name,
      surname: this.state.surname,
      email: this.state.email,
      password: this.state.password
    }

    let doSomething = () => {

      function validEmail(e) {
        let filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
        return String(e).search (filter) != -1;
      }

      if (!object.name) return changeSnackBarName()
      if (!object.surname) return changeSnackBarSurname()
      if (!object.password) return changeSnackBarPassword()
      if (!object.email || validEmail(object.email) == false ) return changeSnackBarEmail()
      
      let array = Array.from(this.state.tag);
      object.projects = array
      fetch('https://reactmanagebe.herokuapp.com/api/users',
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include',
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
          placeholder="Np. Jan"
          required='true'
          margin="normal"
          autoComplete="off"
          onChange={this.handleChange('name')}
        />
        <TextField
          id="surname"
          label="Nazwisko"
          placeholder="Np. Kowalski"
          required='true'
          margin="normal"
          autoComplete="off"
          onChange={this.handleChange('surname')}
        />
        <TextField
          id="email"
          label="Email"
          required='true'
          placeholder="Np. kowalski@gmail.com"
          margin="normal"
          autoComplete="off"
          onChange={this.handleChange('email')}
        />

        <TextField
          id="password"
          type="password"
          label="Password"
          placeholder="Np. qwe123 :)"
          required='true'
          margin="normal"
          autoComplete="off"
          onChange={this.handleChange('password')}
        />

        <Button color="primary" style={{paddingLeft:'8px', marginTop:'10px'}} onClick={doSomething}>
            Dodaj uzytkownika
          </Button>
      
          <Snackbar
            open={this.state.open}
            message="Dodano uzytkownika"
            autoHideDuration={2000}
            onClose={this.handleRequestClose}
          />

          <Snackbar
            open={this.state.openError}
            message="Błąd serwera"
            autoHideDuration={2000}
            onClose={this.handleRequestClose}
          />

          <Snackbar
            open={this.state.openName}
            message="Nie wpisano imienia"
            autoHideDuration={1000}
          />
          
          <Snackbar
            open={this.state.openPassword}
            message="Nie wpisano imienia"
            autoHideDuration={1000}
          />

          <Snackbar
            open={this.state.openSurname}
            message="Nie wpisano nazwiska"
            autoHideDuration={1000}
          />

          <Snackbar
            open={this.state.openEmail}
            message="Niepoprawny email"
            autoHideDuration={1000}
          />
      </div>
    );
  }
}

export default (AddUser);