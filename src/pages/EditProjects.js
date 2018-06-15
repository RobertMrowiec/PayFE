import React, {Component} from 'react';
import TextField from 'material-ui/TextField'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/Menu/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import Button from 'material-ui/Button';
import { Link, Redirect } from 'react-router-dom';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import { ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Select from 'material-ui/Select';
import Typography from 'material-ui/Typography';
import 'typeface-roboto'

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

const divStyleforText = {
  width: '100%',
  margin: 'auto',
  maxWidth: 500
};


class AddProjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      openError: false,
      name: '',
      amount: '',
      redirect: false,
      tag: new Set(),
      values: []
    }
  }

  componentDidMount() {
    fetch('https://reactmanagebe.herokuapp.com/api/projects/' + this.props.match.params.id)
      .then( response => response.json())
      .then( data => this.setState({
        name: data.name,
        amount: data.amount
      })).then(() => {
        fetch('https://reactmanagebe.herokuapp.com/api/users')
        .then( response => response.json())
        .then( data => this.setState({values: data}))
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
      setTimeout(() => {this.setState({redirect: true})}, 1000)
    }

    let changeSnackBarToError = () => {
      this.setState({
        openError: true,
      });
    }

    let object = {
      name: this.state.name,
      amount: this.state.amount
    }
    
    let Edit = () => {
      let array = Array.from(this.state.tag);
      object.users = array
      fetch('https://reactmanagebe.herokuapp.com/api/projects/' + this.props.match.params.id,
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

    return (
      <div>
        <div style={{marginLeft: '-5%'}}>
        <Typography variant = 'display1' align='center'> Aktualnie edytujesz projekt: </Typography>
        <Typography variant = 'display3' align='center'> {this.state.name} </Typography>
        </div>

        <div style={style.div}>
         
          <TextField
            id="name"
            label= 'Nazwa projektu'
            placeholder= {this.state.name}
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
            placeholder= {this.state.amount}
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
                  <ListItemText primary={tag.name + ' ' + tag.surname} />
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
            message="Edytowano projekt"
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
      </div>
    )
  }
}

export default AddProjects;