import React, {Component} from 'react';
import TextField from 'material-ui/TextField'
import { FormControl } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import { ListItemText } from 'material-ui/List';
import Select from 'material-ui/Select';
import Input, { InputLabel } from 'material-ui/Input';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/Menu/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import Button from 'material-ui/Button';
import { Link, Redirect } from 'react-router-dom';
import { log } from 'util';
import Typography from 'material-ui/Typography';

const style = {
  div: {
    margin: 'auto',
    width: '15%',
    padding: '10px'
  },
  customWidth: {
    margin: 'auto',
    width: '100%'
  }
}

class AddProjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      openError: false,
      name: '',
      redirect: false,
      tag: new Set(),
      values: []
    }
  }

  componentDidMount() {
    fetch('https://reactmanagebe.herokuapp.com/api/users')
      .then( response => response.json())
      .then( data => this.setState({values: data}))
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

  handleTagChange = event => {
    this.setState({ tag: new Set(event.target.value) });
  };

  render(){
    const { redirect } = this.state

    if (redirect) {
      return (
        <Redirect to={{pathname: '/app/projects' }}/>
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
      amount: this.state.amount,
      users: this.state.tag
    }
    
    let doSomething = () => {
      if (!this.state.tag) {
        object.users = []
      }
      else {
        let array = Array.from(this.state.tag);
        object.users = array
      }
      fetch('https://reactmanagebe.herokuapp.com/api/projects',
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
      <div style={style.div}>
          <TextField
            id="name"
            label="Nazwa projektu"
            placeholder="Np.BPC"
            margin="normal"
            onChange={this.handleChange('name')}
          />
          
          <TextField
            id="number"
            label="Kwota"
            type="number"
            InputLabelProps={{
              shrink: true
            }}
            margin="normal"
            onChange={this.handleChange('amount')}
          />
          
          <FormControl style={{minWidth:166, maxWidth: 166}}>
          <InputLabel htmlFor="tag-multiple">Uzytkownicy</InputLabel>
          <Select
            multiple
            value={[...this.state.tag]}
            onChange={this.handleTagChange}
            input={<Input id="tag-multiple" />}
            renderValue={selected => selected.join(', ')}
          >
            {this.state.values.map(tag => (
              <MenuItem key={tag.id} value={tag._id}>
                <Checkbox checked={this.state.tag.has(tag._id)} />
                <ListItemText primary={tag.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

          <Button raised color="primary" style={{marginLeft:'4.7%', marginTop:'10px'}} onClick={doSomething}>
            Dodaj projekt
          </Button>
      
          <Snackbar
            open={this.state.open}
            message="Dodano projekt"
            autoHideDuration={2000}
            onClose={this.handleRequestClose}
          />

          <Snackbar
            open={this.state.openError}
            message="Bląd podczas dodawania"
            autoHideDuration={2000}
            onClose={this.handleRequestClose}
          />
      </div>
    )
  }
}

export default AddProjects;