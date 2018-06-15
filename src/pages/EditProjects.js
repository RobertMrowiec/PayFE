import React, {Component} from 'react';
import TextField from 'material-ui/TextField'
import MenuItem from 'material-ui/Menu/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import Button from 'material-ui/Button';
import { Redirect } from 'react-router-dom';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import { ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Select from 'material-ui/Select';
import Typography from 'material-ui/Typography';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'typeface-roboto';

const style = {
  div: {
    margin: 'auto',
    marginLeft: '44.5%',
    width: '15%',
    padding: '10px'
  },
  customWidth: {
    margin: 'auto',
    width: '100%'
  }
}
class EditProjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorStyle: {
        border: '1px solid black',
        padding: '5px',
        borderRadius: '2px',
        height: '100px',
        width: '100%'
      },
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
    fetch('https://reactmanagebe.herokuapp.com/api/projects/' + this.props.match.params.id, {credentials: 'include'})
      .then( response => response.json())
      .then( data => {
        this.setState({
          name: data.name,
          old: data.old,
          amount: String(data.amount),
          tag: new Set(data.users),
          port: data.port,
          hosting: data.hosting,
          hostingLogin: data.hostingLogin,
          hostingPassword: data.hostingPassword,
          hostingPrice: data.hostingPrice,
          hostingDateStart: data.hostingDateStart,
          hostingDateNotify: data.hostingDateNotify,
          domain: data.domain,
          domainLogin: data.domainLogin,
          domainPassword: data.domainPassword,
          domainPrice: data.domainPrice,
          domainDateStart: data.domainDateStart,
          domainDateNotify: data.domainDateNotify,
          clientNumber: data.clientNumber,
          description: data.description || ''
        })

      }).then(() => {
        fetch('https://reactmanagebe.herokuapp.com/api/users', {credentials: 'include'})
        .then( response => response.json())
        .then( data => this.setState({values: data.users}))
      })
      .catch(err => {
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

  handleTagChange = event => {
    this.setState({ tag: new Set(event.target.value) });
  };

  showHosting() {
    if (this.state.hosting == true){
      return (
        <div style={{marginLeft:'-210px'}}>
          <TextField
            id="amountHosting"
            label="Kwota za hosting"
            type="number"
            InputLabelProps={{
              shrink: true
            }}
            placeholder={this.state.hostingPrice}            
            style={{padding:"5px"}}
            margin="normal"
            onChange={this.handleChange('hostingPrice')}
          />
  
          <TextField
            id="startDateHosting"
            label="Data startu"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            placeholder={this.state.hostingDateStart}            
            style={{padding:"5px"}}
            margin="normal"
            onChange={this.handleChange('hostingDateStart')}
          />
  
          <TextField
            id="dateHostingNotification"
            label="Data powiadomienia"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            placeholder={this.state.hostingDateNotify}            
            style={{padding:"5px"}}
            margin="normal"
            onChange={this.handleChange('hostingDateNotify')}
          />
        </div>
        )
    }
    else {
      return (
        <div>
        </div>
      )      
    }
  }

  showDomain() {
    if (this.state.domain == true){
      return (
        <div style={{marginLeft:'-210px'}}>
            <TextField
            id="amountDomain"
            label="Kwota za domenę"
            type="number"
            InputLabelProps={{
              shrink: true
            }}
            placeholder={this.state.domainPrice}
            style={{padding:"5px"}}
            margin="normal"
            onChange={this.handleChange('domainPrice')}
          />

          <TextField
            id="startDateDomain"
            label="Data startu"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            placeholder={this.state.domainDateStart}            
            style={{padding:"5px"}}
            margin="normal"
            onChange={this.handleChange('domainDateStart')}
          />

          <TextField
            id="dateDomainNotification"
            label="Data powiadomienia"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            placeholder={this.state.domainDateNotify}            
            style={{padding:"5px"}}
            margin="normal"
            onChange={this.handleChange('domainDateNotify')}
          />
        </div>
      )
    }
    else {
      return (
        <div>
        </div>
      )      
    }
  }

  changeDescription = value => {
    this.setState({ description: value })
  }

  oldFunction = value => {    
    if(value == true){
      return (
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked="true"
                onChange={this.handleChangeCheckbox('old')}
                value="old"
                color="primary"
              />
            }
            label="Stary"
          />
        </div>
      )
    }
    else if (value == false) {
      return (
        <div>
          <FormControlLabel
            control={
              <Checkbox
                onChange={this.handleChangeCheckbox('old')}
                value="old"
                color="primary"
              />
            }
            label="Stary"
          />
        </div>
      )
    }
  }

  render(){
    const { redirect } = this.state
    const { redirectLogin } = this.state

    if (redirectLogin) {
      return (
        <Redirect to={{pathname: '/login' }}/>
      )
    }
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
      old: this.state.old,
      amount: this.state.amount,
      users: this.state.tag,
      port: this.state.port,
      hosting: this.state.hosting,
      hostingLogin: this.state.hostingLogin,
      hostingPassword: this.state.hostingPassword,
      hostingPrice: this.state.hostingPrice,
      hostingDateStart: this.state.hostingDateStart,
      hostingDateNotify: this.state.hostingDateNotify,
      domain: this.state.domain,
      domainLogin: this.state.domainLogin,
      domainPassword: this.state.domainPassword,
      domainPrice: this.state.domainPrice,
      domainDateStart: this.state.domainDateStart,
      domainDateNotify: this.state.domainDateNotify,
      clientNumber: this.state.clientNumber,
      description: this.state.description || ''
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

    return (
      <div>
        <div style={{marginTop:'-80px'}}>
          <Typography variant = 'display1' align='center'> Aktualnie edytujesz projekt: </Typography>
          <Typography variant = 'display3' align='center'> {this.state.name} </Typography>
        </div>
    
        <div style={{marginLeft: '40%', marginTop: '4%'}}>
          <div style={{display: 'flex'}}>
            <div style={{marginTop: '-8%'}}>
              <table>
                <td>
                  <tr>
                    <TextField
                      id="name"
                      label="Nazwa projektu"
                      placeholder={this.state.name}
                      margin="normal"
                      style={{padding:"5px"}}
                      required={true}
                      onChange={this.handleChange('name')}
                    />

                    <FormControl style={{minWidth:166, maxWidth: 166, padding:"5px"}}>
                    <InputLabel htmlFor="tag-multiple">Uzytkownicy</InputLabel>
                    <Select
                      multiple
                      value={[...this.state.tag]}
                      onChange={this.handleTagChange}
                      input={<Input id="tag-multiple" />}
                      renderValue={selected => `Wybranych: ${selected.length}`}
                    >
                      {this.state.values.map(tag => (
                        <MenuItem key={tag.id} value={tag._id}>
                          <Checkbox checked={this.state.tag.has(tag._id)} />
                          <ListItemText primary={tag.name + ' ' + tag.surname} />
                        </MenuItem>
                      ))}
                    </Select>
                    </FormControl>
                  </tr>

                  <tr>
                    <TextField
                      id="number"
                      label="Kwota"
                      type="number"
                      InputLabelProps={{
                        shrink: true
                      }}
                      placeholder={this.state.amount}
                      style={{padding:"5px"}}
                      margin="normal"
                      onChange={this.handleChange('amount')}
                    />

                    <TextField
                      id="port"
                      label="Port"
                      type="number"
                      placeholder={this.state.port}
                      InputLabelProps={{
                        shrink: true
                      }}
                      style={{padding:"5px"}}
                      margin="normal"
                      onChange={this.handleChange('port')}
                    />
                  </tr>
                </td>
              </table>

              <table>
                <td>                
                  <tr>
                    <TextField
                      id="hostingLogin"
                      label="Login do hostingu"
                      type="text"
                      InputLabelProps={{
                        shrink: true
                      }}
                      style={{padding:"5px"}}
                      placeholder={this.state.hostingLogin}
                      margin="normal"
                      required = "true"
                      onChange={this.handleChange('hostingLogin')}
                    />

                    <TextField
                      id="hostingPassword"
                      label="Hasło do hostingu"
                      type="password"
                      InputLabelProps={{
                        shrink: true
                      }}
                      style={{padding:"5px"}}
                      margin="normal"
                      required = "true"
                      onChange={this.handleChange('hostingPassword')}
                    />
                  </tr>

                  <tr>
                    <TextField
                      id="domainLogin"
                      label="Login do domeny"
                      type="text"
                      InputLabelProps={{
                        shrink: true
                      }}
                      placeholder={this.state.domainLogin}
                      style={{padding:"5px"}}
                      margin="normal"
                      required = "true"
                      onChange={this.handleChange('domainLogin')}
                    />

                    <TextField
                      id="domainPassword"
                      label="Hasło do domeny"
                      type="password"
                      InputLabelProps={{
                        shrink: true
                      }}
                      style={{padding:"5px"}}
                      margin="normal"
                      required = "true"
                      onChange={this.handleChange('domainPassword')}
                    />
                  </tr>
                  <tr>
                    <TextField
                      id="contact"
                      label="Nr. do klienta"
                      type="text"
                      InputLabelProps={{
                        shrink: true
                      }}
                      placeholder={this.state.clientNumber}
                      style={{marginLeft:'16%'}}
                      margin="normal"
                      onChange={this.handleChange('clientNumber')}
                    />
                  </tr>
                  <tr>
                    <div style={{marginLeft:'-20%', minWidth:'620px', maxWidth:'620px'}}>
                    
                    <ReactQuill 
                      value={this.state.description || ''}
                      onChange={this.changeDescription}
                    />
                    
                    </div>
                  </tr>
                </td>
              </table>
            </div>

          </div>

          <div style={{marginLeft:"130px"}}>
          
            {this.oldFunction(this.state.old)}
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.hosting}
                  onChange={this.handleChangeCheckbox('hosting')}
                  value="hosting"
                  color="primary"
                />
              }
              label="Hosting"
            />
            
            {this.showHosting()}

            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.domain}
                  onChange={this.handleChangeCheckbox('domain')}
                  value="domain"
                  color="primary"
                />
              }
              label="Domena"
            />

            {this.showDomain()}
          </div>

          <div style={{marginLeft:'90px'}}>
            <Button color="primary" style={{marginLeft:'unset', marginTop:'10px'}} onClick={Cancel}>
              Cofnij
            </Button>
            <Button color="primary" style={{paddingLeft:'8px', marginTop:'10px'}} onClick={Edit}>
              Edytuj
            </Button>
          </div>
      
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
    )  }
}

export default EditProjects;