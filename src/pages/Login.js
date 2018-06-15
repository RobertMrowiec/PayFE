import React from 'react';
import TextField from 'material-ui/TextField'
import Snackbar from 'material-ui/Snackbar';
import Button from 'material-ui/Button';
import { Redirect } from 'react-router-dom';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';

const styles = theme => ({
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
  },
  root: {
    marginLeft: '8%',
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    // position: 'relative',
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

class Login extends React.Component {
  constructor(props) {
    super(props);
      this.state = {    
        open: false,
        password:'',
        email:'',
        loading: false
      };
  }

  componentDidMount() {
    fetch('https://reactmanagebe.herokuapp.com/login/logout', {credentials: 'include'})
      .then( response => response.json())
  }
  handleRequestClose = () => {
    this.setState({
      open: false
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
    const { isLoading } = this.state
    const { classes } = this.props

    if (isLoading) {
      return <CircularProgress style={{
        'width': '75px',
        'margin-left': '46%',
        'margin-top': '15%'
      }}/>
    }

    if (redirect) {
      return (
        <Redirect to={{pathname: '/app/dashboard' }}/>
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
      email: this.state.email,
      password: this.state.password
    }

    let doSomething = () => {
      this.setState({ isLoading: true });
      fetch('https://reactmanagebe.herokuapp.com/login',
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "POST",
          credentials: 'include',
          body: JSON.stringify(object)
        }
      ).then(response => response)
      .then(response => {
        if (response.status != 200) {
          return changeSnackBarToError()
        }
      })
      .then(() => this.setState({isLoading: false}))
      .then(changeSnackBar)
      .catch(changeSnackBarToError)
    }

    return (
      <div className={classes.div}>

        <div className={classes.root}>
          <AppBar position="absolute" className={classes.appBar}>
            <Toolbar>
              <Typography type="title" color="inherit" noWrap>
                <Button className={classes.button} href='/app/dashboard/' disabled="true"> Surprise.Design </Button>
              </Typography>
            </Toolbar>
          </AppBar>

          <TextField
            id="email"
            label="Email"
            required='true'
            margin="normal"
            onChange={this.handleChange('email')}
          />
          
          <TextField
            id="password"
            label="Password"
            type="password"
            required='true'
            margin="normal"
            onChange={this.handleChange('password')}
          />

          <Button color="primary" style={{marginLeft:'12%', paddingLeft:'8px', marginTop:'4%'}} onClick={doSomething}>
            Zaloguj się
          </Button>
      
          <Snackbar
            open={this.state.open}
            message="Zalogowano pomyślnie"
            autoHideDuration={2000}
            onClose={this.handleRequestClose}
          />

          <Snackbar
            open={this.state.openError}
            message="Błąd logowania"
            autoHideDuration={2000}
            onClose={this.handleRequestClose}
          />

        </div>
      </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Login)
