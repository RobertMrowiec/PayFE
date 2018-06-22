import React from 'react';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField'
import { Input, InputLabel } from 'material-ui/Input';
import Snackbar from 'material-ui/Snackbar';
import Button from 'material-ui/Button';
import { Redirect } from 'react-router-dom';
import { ListItemText } from 'material-ui/List';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CircularProgress } from 'material-ui/Progress';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';
import plLocale from 'date-fns/locale/pl';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

const style = {
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
}


class EditSalaries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      isDrawerOpen: false,
      amount: '',
      title: '',
      userId:'',
      projectId: '',
      userName: '',
      projectName: '',
      projects: [],
      users: []
    }
  }

  componentDidMount() {
    fetch('https://reactmanagebe.herokuapp.com/api/salaries/' + this.props.match.params.id, {credentials: 'include'})
      .then( response => response.json())
      .then( data => {
        if (data.projectId) this.setState({
          projectId: data.projectId._id,
          projectName: data.projectId.name
        })
        
        this.setState({
          title: data.title,
          amount: data.amount,
          userId: data.userId._id,
          userName: data.userId.name,
          potentially: data.potentially,
          description: data.description,
          selectedDate: data.selectedDate || Date.now()
        })
        
      }).then(() => {
        fetch('https://reactmanagebe.herokuapp.com/api/projects', {credentials: 'include'})
        .then( response => response.json())
        .then( data => {
          this.setState({
            projects: data.projects.sort((a,b) => a.name > b.name)
          })
        })
      }).then(() => {
        fetch('https://reactmanagebe.herokuapp.com/api/users/projects/' + this.state.projectId, {
          credentials: 'include'
      }).then(response => response.json())
        .then(data => {
          this.setState({users: data.sort((a,b) => a.name > b.name)})
        })
      }).catch(err => {
        if (err == 'TypeError: Failed to fetch') return this.setState({redirectLogin: true})
      })
  }

  
  handleRequestClose = () => {
    this.setState({
      open: false,
      openError: false
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
  
  potentiallyFunction = value => {    
    if(value == true){
      return (
        <div>
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked="true"
                  onChange={this.handleChangeCheckbox('potentially')}
                  value="potentially"
                  color="primary"
                />
              }
              label="Potencjalna"
            />
          </div>
            <DayPickerInput onDayChange={this.handleDateChange} value={this.state.selectedDate}/>
        </div>      
      )
    }
    else if (value == false) {
      return (
        <div>
          <FormControlLabel
            control={
              <Checkbox
                onChange={this.handleChangeCheckbox('potentially')}
                value="potentially"
                color="primary"
              />
            }
            label="Potencjalna"
          />
        </div>
      )
    }
  }

  render(){
    const { redirect } = this.state
    const { redirectLogin } = this.state
    const { isLoading } = this.state

    if (isLoading) {
      return <CircularProgress style={{
        'width': '75px',
        'margin-left': '47%',
        'margin-top': '10%'
      }}/>
    }

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
      projectId: this.state.projectId,
      userId: this.state.userId,
      potentially: this.state.potentially,
      description: this.state.description || '',
      selectedDate: this.state.selectedDate
    }
    
    let Edit = () => {
      this.setState({isLoading: true})
      fetch('https://reactmanagebe.herokuapp.com/api/salaries/' + this.props.match.params.id,
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
      }).then(() => this.setState({isLoading: false}))
        .then(changeSnackBar)
        .catch(changeSnackBarToError)
    }
    
    let Cancel = () => this.setState({redirect: true})

    return (
      <div>
        <div style={{float:'right', marginRight:'1.5%'}}>
          <Button color="primary" style={{marginLeft:'unset', marginTop:'10px'}} onClick={Cancel}>
            Cofnij
          </Button>
        </div>


        <div style={style.div}>
          <TextField
            id="title"
            label="Tytuł"
            placeholder={this.state.title}
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
            placeholder={this.state.amount}
            margin="normal"
            onChange={this.handleChange('amount')}
          />

          <FormControl  style={{minWidth:166, maxWidth: 166}}>
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
                <MenuItem key = {proj._id} value = {proj._id}>
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
                <MenuItem key = {user._id} value = {user._id}>
                  <ListItemText primary = {user.name + ' ' + user.surname} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {this.potentiallyFunction(this.state.potentially)}

          <div style={{marginLeft:'-220px', minWidth:'620px', maxWidth:'620px'}}>
            <ReactQuill 
              value={this.state.description || ''}
              onChange={this.changeDescription}
            />
          </div>

          <br/>

            <Button color="primary" style={{marginLeft:'4.7%', marginTop:'10px'}} onClick={Edit}>
              Edytuj
            </Button>

            <Snackbar
              open={this.state.open}
              message="Edytowano wypłatę"
              autoHideDuration={2000}
              onClose={this.handleRequestClose}
            />

            <Snackbar
              open={this.state.openError}
              message="Błąd podczas edytowania"
              autoHideDuration={2000}
              onClose={this.handleRequestClose}
            />
        </div>    
      </div>
    )
  }
}

export default EditSalaries;