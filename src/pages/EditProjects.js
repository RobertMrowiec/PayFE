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
import { CircularProgress } from 'material-ui/Progress';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'typeface-roboto';
console.log(React.version);

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
          description: data.description || '',
          monthly: data.monthly || false
        })
        this.setState({isLoading: true})
      }).then(() => {
        fetch('https://reactmanagebe.herokuapp.com/api/users', {credentials: 'include'})
        .then( response => response.json())
        .then( data => this.setState({values: data.users}))
        .then(() => this.setState({isLoading: false}))
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

  changeDescription = value => {
    this.setState({ description: value })
  }

  showHosting() {
    if (this.state.hosting == true){
      return (
        <div style={{display: 'flex', justifyContent: 'center', marginRight: '140px'}}>
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
        <div >
        </div>
      )      
    }
  }

  showDomain() {
    if (this.state.domain == true){
      return (
        <div style={{display: 'flex', justifyContent: 'center', marginRight: '140px'}}>
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

  oldFunction = value => {    
    if(value == true){
      return (
        <div style={{display: 'flex', justifyContent: 'center', marginRight: '110px'}}>
          <FormControlLabel
            control={
              <Checkbox
                checked="true"
                onChange={this.handleChangeCheckbox('old')}
                value="old"
                color="primary"
              />
            }
            label="Stary projekt"
          />
        </div>
      )
    }
    else if (value == false) {
      return (
        <div style={{display: 'flex', justifyContent: 'center', marginRight: '110px'}}>
          <FormControlLabel
            control={
              <Checkbox
                onChange={this.handleChangeCheckbox('old')}
                value="old"
                color="primary"
              />
            }
            label="Stary projekt"
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
      <div style={{marginTop: '-4%'}}>
        <div> 
          <Button color="primary" style={{float:'right', marginTop: '-2%', marginRight: '1.3%'}} onClick={Cancel}>
            Cofnij
          </Button>
        </div>

          <Typography variant = 'display1' align='center'> Aktualnie edytujesz projekt: </Typography>
          <Typography variant = 'display3' align='center'> {this.state.name} </Typography>
    
        <div>
          <div>
              <table style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
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

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.monthly}
                          onChange={this.handleChangeCheckbox('monthly')}
                          value="monthly"
                          color="primary"
                        />
                      }
                      label="Miesięcznie"
                    />                  
                  </tr>
                </td>
              </table>

              <table style={{display: 'flex', justifyContent: 'center', marginLeft: '265px'}}>
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
                      style={{padding: '5px'}}
                      margin="normal"
                      onChange={this.handleChange('clientNumber')}
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
              style={{display: 'flex', justifyContent:'center', marginRight: '155px'}}
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
              style={{display: 'flex', justifyContent:'center', marginRight: '152px'}}
            />
            {this.showDomain()}
          </div>

          <div style={{display: 'flex', justifyContent:'center', marginRight: '50px'}}>
            <Button color="primary" style={{paddingLeft:'20px', marginTop:'10px'}} onClick={Edit}>
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