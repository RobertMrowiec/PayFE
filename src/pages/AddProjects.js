import React, {Component} from 'react';
import TextField from 'material-ui/TextField'
import { FormControl } from 'material-ui/Form';
import { ListItemText } from 'material-ui/List';
import Select from 'material-ui/Select';
import Input, { InputLabel } from 'material-ui/Input';
import MenuItem from 'material-ui/Menu/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import Button from 'material-ui/Button';
import { Redirect } from 'react-router-dom';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const style = {
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
    fetch('https://reactmanagebe.herokuapp.com/api/users', {credentials: 'include'})
      .then( response => response.json())
      .then( data => this.setState({values: data.users}) )
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

  handleChangeDate = (name, name2) => event => {
    if (event.target.value.length == 10){
      let nextYearDate = new Date(event.target.value);
      nextYearDate.setDate(nextYearDate.getDate() + 352);
      nextYearDate = nextYearDate.toISOString().slice(0,10)

      this.setState({
        [name]: event.target.value,
        [name2]: nextYearDate
      });
    } else {
      return 
    }
  };

  handleTagChange = event => {
    this.setState({ tag: new Set(event.target.value) });
  };

  changeDescription = value => {
    this.setState({ description: value })
  }

  
  showHosting() {
    if (this.state.hosting == true){
      return (
        <div style={{marginLeft:'-25%'}}>
          <TextField
            id="amountHosting"
            label="Kwota za hosting"
            type="number"
            InputLabelProps={{
              shrink: true
            }}
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
            style={{padding:"5px"}}
            margin="normal"
            onChange={this.handleChangeDate('hostingDateStart', 'hostingDateNotify')}
          />

          <TextField
            id="dateHostingNotification"
            label="Data powiadomienia"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            value={this.state.hostingDateNotify}
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
        <div style={{marginLeft:'-25%'}}>
            <TextField
            id="amountDomain"
            label="Kwota za domenę"
            type="number"
            InputLabelProps={{
              shrink: true
            }}
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
            style={{padding:"5px"}}
            margin="normal"
            onChange={this.handleChangeDate('domainDateStart', 'domainDateNotify')}
          />

          <TextField
            id="dateDomainNotification"
            label="Data powiadomienia"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            value={this.state.domainDateNotify}
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

    let Cancel = () => this.setState({redirect: true})

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

    let changeSnackBarToName = () => {
      this.setState({
        openErrorName: true,
      });
    }

    let changeSnackBarToAmount = () => {
      this.setState({
        openErrorAmount: true,
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
      domain: this.state.domain,
      domainLogin: this.state.domainLogin,
      domainPassword: this.state.domainPassword,
      clientNumber: this.state.clientNumber,
      description: this.state.description || '',
      monthly: this.state.monthly
    }
    
    if (this.state.hosting){
      object.hostingPrice= this.state.hostingPrice
      object.hostingDateStart= this.state.hostingDateStart
      object.hostingDateNotify= this.state.hostingDateNotify
    }
    
    if (this.state.domain){
      object.domainPrice= this.state.domainPrice
      object.domainDateStart= this.state.domainDateStart
      object.domainDateNotify= this.state.domainDateNotify
    }

    let doSomething = () => {
      if (!object.name) return changeSnackBarToName()
      if (!object.amount) return changeSnackBarToAmount()

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
      <div>
        <div style={{float:'right', marginRight:'1.5%'}}>
          <Button color="primary" style={{marginLeft:'unset', marginTop:'10px'}} onClick={Cancel}>
            Cofnij
          </Button>
        </div>

        <div style={{marginLeft: '40%'}}>
          <div>
            <div style={{marginTop: '-8%'}}>
              <table>
                <td>
                  <tr>
                    <TextField
                      id="name"
                      label="Nazwa projektu"
                      placeholder="Np.BPC"
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
                      required="true"
                      InputLabelProps={{
                        shrink: true
                      }}
                      style={{padding:"5px"}}
                      margin="normal"
                      onChange={this.handleChange('amount')}
                    />

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={this.state.monthly}
                            onChange={this.handleChangeCheckbox('monthly')}
                            value="monthly"
                            color="primary"
                          />
                        }
                        style={{marginTop: "-25px"}}
                        label="Miesięcznie"
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
                      style={{padding:"5px"}}
                      margin="normal"
                      onChange={this.handleChange('clientNumber')}
                    />
                    <TextField
                      id="port"
                      label="Port"
                      type="number"
                      InputLabelProps={{
                        shrink: true
                      }}
                      style={{padding:"5px"}}
                      margin="normal"
                      onChange={this.handleChange('port')}
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

            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.old}
                  onChange={this.handleChangeCheckbox('old')}
                  value="old"
                  color="primary"
                />
              }
              label="Stary projekt"
            />

            <br/>

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

          <Button color="primary" style={{marginLeft:'107px', marginTop:'10px'}} onClick={doSomething}>
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

          <Snackbar
            open={this.state.openErrorName}
            message="Nie wpisano nazwy"
            autoHideDuration={1000}
          />
          
          <Snackbar
            open={this.state.openErrorAmount}
            message="Nie wpisano kwoty"
            autoHideDuration={1000}
          />
        </div>
      </div>
    )
  }
}

export default AddProjects;