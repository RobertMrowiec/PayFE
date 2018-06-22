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
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { DatePicker } from 'material-ui-pickers';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import plLocale from 'date-fns/locale/pl';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

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
    marginLeft: '44.5%',
    marginTop:'-6%',
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
      users: [],
      selectedDate: Date.now()
    } 
  }

  componentDidMount() {
    fetch('https://reactmanagebe.herokuapp.com/api/projects', {credentials: 'include'})
      .then( response => response.json())
      .then( projects => this.setState({projects: projects.projects.sort((a,b) => a.name > b.name)}))
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

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleChangeCheckbox = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleDateChange = (date) => {
    this.setState({ selectedDate: date });
  }

  changeDescription = value => {
    this.setState({ description: value })
  }

  handleChangeProject = name => event => {
    this.setState({[name]: event.target.value})
    return fetch('https://reactmanagebe.herokuapp.com/api/users/projects/' + event.target.value, {
      credentials: 'include'
      }).then(response => response.json())
        .then(data => {
          this.setState({users: data.sort((a,b) => a.name > b.name)})
        })
  };

  datePickerForm() {
    if (this.state.potentially){
      return (
        <div style={{marginBottom: '10px'}}>
          {/* <MuiPickersUtilsProvider utils={DateFnsUtils} >
            <DatePicker
              value={this.state.date}
              onChange={this.handleDateChange}
            />
          </MuiPickersUtilsProvider> */}

          {/* <DayPickerInput onDayChange={this.handleDateChange}/> */}
          <TextField
            id="selectedDate"
            label="Potencjalna data"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            style={{padding:"5px"}}
            margin="normal"
            onChange={this.handleDateChange}
          />

        </div>
      )
    } else {
      return (
        <div></div>
      )
    }
  }

  disableUserForm() {
    if (this.state.users && this.state.users.length > 0){
      return (
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
              <MenuItem key = {user._id} value = {user._id}>
                <ListItemText primary = {user.name + ' ' + user.surname} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )
    }
    else {
      return (
        <FormControl style={{minWidth:166, maxWidth: 166}}>
          <InputLabel htmlFor="users-simple"> Odbiorca </InputLabel>
          <Select
            value={this.state.userId}
            onChange={this.handleChange('userId')}
            inputProps={{
              name: 'users',
              id: 'users-simple',
            }}
            disabled="true"
          >
          </Select>
        </FormControl>
      )
    }
  }

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
        <Redirect to={{pathname: '/app/salaries' }}/>
      )
    }

    let Cancel = () => {
      {this.setState({redirect: true})}
    }

    let changeSnackBar = () => {
      this.setState({
        open: true,
      });
      setTimeout(() => {this.setState({redirect: true})}, 1500)
    }

    let changeSnackBarMoney = () => {
      this.setState({
        openMoneyError: true,
      });
      setTimeout(() => {this.setState({redirect: true})}, 1500)
    }

    let changeSnackBarToError = () => {
      this.setState({
        openError: true,
      });
    }

    let changeSnackBarToAmount = () => {
      this.setState({
        openAmountError: true,
      });
    }

    let changeSnackBarToUser = () => {
      this.setState({
        openUserError: true,
      });
    }

    let object = {
      title: this.state.title,
      potentially: this.state.potentially || false,
      selectedDate: this.state.selectedDate,
      amount: this.state.amount,
      userId: this.state.userId,
      projectId: this.state.projectId || null,
      description: this.state.description || ''
    }

    let doSomething = () => {
      if (!object.userId) return changeSnackBarToUser()
      if (!object.amount) return changeSnackBarToAmount()
      fetch('https://reactmanagebe.herokuapp.com/api/salaries', 
        {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify(object)
        }
      ).then(response => response.json())
      .then(response => {
          if (response.message === 'No money') return changeSnackBarMoney()
          else if (response === "Done") return changeSnackBar()
          else return changeSnackBarToError()
      })
    }

    return (
      <div>

        <div style={{marginTop:'1.5%', float:'right',marginRight:'1.5%'}}>
          <Button color="primary" style={{marginLeft:'unset', marginTop:'10px'}} onClick={Cancel}>
            Cofnij
          </Button>
        </div>

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
            required="true"
            InputLabelProps={{
              shrink: true
            }}
            margin="normal"
            onChange={this.handleChange('amount')}
          />


          <FormControl style={{minWidth:166, maxWidth: 166}}>
            <InputLabel htmlFor="projects-simple"> Projekt </InputLabel>
            <Select
              value={this.state.projectId}
              onChange={this.handleChangeProject('projectId')}
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
        
          {this.disableUserForm()}
          
          <div></div>

          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.potentially}
                onChange={this.handleChangeCheckbox('potentially')}
                value="potentially"
                color="primary"
              />
            }
            label="Potencjalna"
          />

          <div></div>

          {this.datePickerForm()}

          <div style={{marginLeft:'-220px', minWidth:'620px', maxWidth:'620px'}}>
            <ReactQuill 
              value={this.state.description || ''}
              onChange={this.changeDescription}
            />
          </div>

          <Button color="primary" style={{marginLeft:'4.7%', marginTop:'10px'}} onClick={doSomething}>
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

            <Snackbar
              open={this.state.openAmountError}
              message="Nie wpisano kwoty"
              autoHideDuration={1000}
              onClose={this.handleRequestClose}
            />

            <Snackbar
              open={this.state.openUserError}
              message="Nie wybrano programisty"
              autoHideDuration={2000}
              onClose={this.handleRequestClose}
            />

            <Snackbar
              open={this.state.openMoneyError}
              message="Brak pieniędzy w projekcie"
              autoHideDuration={2000}
              onClose={this.handleRequestClose}
            />
        </div>
      </div>
    );
  }
}

export default (AddSalaries);