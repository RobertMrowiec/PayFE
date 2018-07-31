import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import ModeEditIcon from 'material-ui-icons/ModeEdit';
import DeleteIcon from 'material-ui-icons/Delete';
import Typography from 'material-ui/Typography';
import Moment from 'react-moment';
import Dialog, {
  DialogActions,
  DialogTitle,
} from 'material-ui/Dialog';
import { Redirect } from 'react-router-dom';
import { CircularProgress } from 'material-ui/Progress';
import Checkbox from 'material-ui/Checkbox';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { InputLabel } from 'material-ui/Input';
import { ListItemText } from 'material-ui/List';
import { FormControl } from 'material-ui/Form';

import '../App.css';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  },
  button: {
    marginRight: theme.spacing.unit
  },
  buttonEdit: {
    width: '30px',
    height: 30
  }
});

const obj = {}

class GetSalaries extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      salaries: [],
      openDialog: false,
      users: [{_id: 33, name: 'Wyczyść', surname: ''}],
      projects: [{_id: 33, name: 'Wyczyść'}],
      selectedSalary: '',
      userId: '',
      projectId: '',
      startMonth: '',
      endMonth: '',
      months: [
        {id: 33, name: 'Wyczyść'},
        {id: 0, name: 'Styczeń'},
        {id: 1, name: 'Luty'},
        {id: 2, name: 'Marzec'},
        {id: 3, name: 'Kwiecień'},
        {id: 4, name: 'Maj'},
        {id: 5, name: 'Czerwiec'},
        {id: 6, name: 'Lipiec'},
        {id: 7, name: 'Sierpień'},
        {id: 8, name: 'Wrzesień'},
        {id: 9, name: 'Październik'},
        {id: 10, name: 'Listopad'},
        {id: 11, name: 'Grudzień'}
      ]
    }
  }

  deleteFunction (salary) {
    fetch('https://reactmanagebe.herokuapp.com/api/salaries/' + salary, {
      method: 'delete',
      credentials: 'include'
    }).then(() => {
      this.setState({salaries: this.state.salaries.filter(f => f._id !== salary)});
      this.setState({openDialog: false})
    })
  }

  componentDidMount() {
    this.setState({isLoading: true})
    return Promise.all([
      this.fetchSalaries(),
      this.fetchUsers(),
      this.fetchProjects()
    ]).then(x => this.setState({isLoading: false}))
  }

  fetchSalaries = () => {
    return fetch('https://reactmanagebe.herokuapp.com/api/salaries', {
      credentials: 'include'
    })
      .then( response => response.json())
      .then( data => {
        if (data.isAdmin == true) {
          this.setState({salaries: data.salaries})
          this.setState({logged: data.logged})
          this.setState({isAdmin: true})
        }
        else {
          this.setState({salaries: data.salaries})
          this.setState({logged: data.logged})
          this.setState({isAdmin: false})
        }
      }).catch(err => {
        if (err == 'TypeError: Failed to fetch') return this.setState({redirectLogin: true})
      })
  }

  fetchUsers = () => {
    return fetch('https://reactmanagebe.herokuapp.com/api/users', {
      credentials: 'include'
    }).then(x => x.json())
      .then(data => {
        const joinedUsers = this.state.users.concat(data.users.sort((a,b) => a.name > b.name))
        return this.setState({ users: joinedUsers })
      })
      .catch(err => {
        if (err == 'TypeError: Failed to fetch') return this.setState({redirectLogin: true})
      })
  }

  fetchProjects = () => {
    return fetch('https://reactmanagebe.herokuapp.com/api/projects', {
      credentials: 'include'
    }).then(x => x.json())
      .then(data => {
        const joinedProjects = this.state.projects.concat(data.projects.sort((a,b) => a.name > b.name))
        return this.setState({ projects: joinedProjects })
      })
      .catch(err => {
        if (err == 'TypeError: Failed to fetch') return this.setState({redirectLogin: true})
      })
  }


  handleOpen = (salary) => {
    this.setState({ selectedSalary: salary})
    this.setState({ openDialog: true });
  };

  handleClose = () => {
    this.setState({ openDialog: false });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleChangeFilter = name => event => {
    console.log(name, event.target.value);
    
    this.setState({
      [name]: event.target.value,
    });
    
    if (event.target.value === 33){
      delete obj[name]
      return fetch('https://reactmanagebe.herokuapp.com/api/salaries/filter', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(obj)
      }).then(x => x.json())
        .then(data => this.setState({salaries: data}))      
    } else {
      obj[name] = event.target.value
      return fetch('https://reactmanagebe.herokuapp.com/api/salaries/filter', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(obj)
      }).then(x => x.json())
        .then(data => this.setState({salaries: data}))
      }
  };


  descriptionFunction = (description) => {
      if (description.length > 0) {
        description = description.substring(3, description.length - 4)
        if (description.length > 150) {
          return description.substring(0, 150) + '...'
        } else {
          return description
        }
      } 
      return
  }

  disableButtonFunction(button) {
    if (this.state.isAdmin == false){
      return(
        <div style = {{marginLeft: '94%', marginBottom: '0.5%'}}>
          <Button color="primary" aria-label="add" className={styles.button} style={{marginBottom:'-80px'}} component={Link} to="/app/addSalaries" disabled="true">
            <AddIcon />
          </Button>
        </div>
      )
    }
    return(
      <div style = {{marginLeft: '94%', marginBottom: '0.5%'}}>
        <Button color="primary" aria-label="add" className={styles.button} style={{marginBottom:'-80px'}} component={Link} to="/app/addSalaries">
          <AddIcon />
        </Button>
      </div>
    )
  }

  
  render () {
    const { salaries } = this.state
    const { isLoading } = this.state
    const { redirectLogin } = this.state
    const { buttonDisable } = this.state
    
    if (isLoading) {
      return <CircularProgress style={{
        'width': '60px',
        'height': '40px',
        'margin-left': '44%',
        'margin-top': '24%'
      }}/>
    }
    
    if (redirectLogin) {
      return (
        <Redirect to={{pathname: '/login' }}/>
      )
    }
    if (this.state.isAdmin == true) {
      return (
        <div style={{marginTop:'-5%', marginLeft: '162px', marginRight: '20px'}}>
          <div style={{marginLeft: '-5%', marginBottom: '-2%'}}>
            <Typography variant = 'headline' align='center'> Wypłaty: </Typography>
          </div>
          
          {this.disableButtonFunction(buttonDisable)}

          <FormControl style={{minWidth:166, maxWidth: 166}}>
            <InputLabel htmlFor="users-simple"> Odbiorca </InputLabel>
            <Select
              value={this.state.userId}
              onChange={this.handleChangeFilter('userId')}
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

          <FormControl style={{minWidth:166, maxWidth: 166}}>
            <InputLabel htmlFor="projects-simple"> Projekt </InputLabel>
            <Select
              value={this.state.projectId}
              onChange={this.handleChangeFilter('projectId')}
              inputProps={{
                name: 'projects',
                id: 'projects-simple',
              }}
            >
              {this.state.projects.map(project => (
                  <MenuItem key = {project._id} value = {project._id}>
                    <ListItemText primary = {project.name } />
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          <FormControl style={{minWidth:166, maxWidth: 166}}>
            <InputLabel htmlFor="startMonth-simple"> Od </InputLabel>
            <Select
              value={this.state.startMonth}
              onChange={this.handleChangeFilter('startMonth')}
              inputProps={{
                name: 'startMonth',
                id: 'startMonth-simple',
              }}
            >
              {this.state.months.map(month => (
                <MenuItem key = {month.id} value = {month.id}>
                  <ListItemText primary = {month.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl style={{minWidth:166, maxWidth: 166}}>
            <InputLabel htmlFor="endMonth-simple"> Do </InputLabel>
            <Select
              value={this.state.endMonth}
              onChange={this.handleChangeFilter('endMonth')}
              inputProps={{
                name: 'endMonth',
                id: 'endMonth-simple',
              }}
            >
              {this.state.months.map(month => (
                <MenuItem key = {month.id} value = {month.id}>
                  <ListItemText primary = {month.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        <Paper className={styles.root}>
          <Table className={styles.table}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Odbiorca</TableCell>
                <TableCell>Projekt</TableCell>
                <TableCell>Tytuł</TableCell>
                <TableCell>Kwota</TableCell>
                <TableCell>Potencjalna</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Komentarz</TableCell>
                <TableCell>Edycja</TableCell>
                <TableCell>Usuwanie</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salaries.map((salary, i) => {
                if (!salary.projectId){
                  salary.projectId = {name: ''}
                }
                if (!salary.userId){
                  salary.userId = {name: '', surname: ''}
                }
                return (
                  <TableRow key={i}>
                    <TableCell>{i+1}</TableCell>
                    <TableCell>{salary.userId.name} {salary.userId.surname}</TableCell>
                    <TableCell>{salary.projectId.name}</TableCell>
                    <TableCell>{salary.title}</TableCell>
                    <TableCell className="currencyTable">{salary.amount.toFixed(2)} zł</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={salary.potentially}
                        color="primary"
                      />
                    </TableCell>

                    <TableCell>
                      <Moment format="YYYY/MM/DD hh:mm">
                        {salary.date}
                      </Moment>
                    </TableCell>

                    <TableCell>
                      {this.descriptionFunction(salary.description)}
                    </TableCell>

                    <TableCell>

                      {/* edycja */}
                      <Button size ='small' color="primary" aria-label="edit" style={{width:'35px', height:'23px'}} href={'/app/editSalaries/' +`${salary._id}`} >
                        <ModeEditIcon />
                      </Button>

                    </TableCell>
                    <TableCell>

                      {/* usuwanie  */}
                      <Button size ='small' color="secondary" aria-label="delete" style={{width:'35px', height:'23px'}} onClick={() => this.handleOpen(salary._id)}>
                        <DeleteIcon />
                      </Button>

                    </TableCell>
                  </TableRow>
                );
              })}
                <Dialog
                    open={this.state.openDialog}
                    onClose={this.handleClose}
                  >
                  <DialogTitle>{"Czy na pewno chcesz usunąć tą wypłatę?"}</DialogTitle>
                  <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                      Anuluj
                    </Button>
                    <Button onClick={() => this.deleteFunction(this.state.selectedSalary)} color="secondary" autoFocus>
                      Usuń
                    </Button>
                  </DialogActions>
                </Dialog>
            </TableBody>
          </Table>
        </Paper>
        </div>
      );
    }
    else {
      return (
        <div style={{marginTop:'-5%', marginLeft: '162px', marginRight: '20px'}}>
          <div style={{marginLeft: '-5%', marginBottom: '-2%'}}>
            <Typography variant = 'headline' align='center'> Wypłaty: </Typography>
          </div>
          
          {this.disableButtonFunction(buttonDisable)}

        <Paper className={styles.root}>
          <Table className={styles.table}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Odbiorca</TableCell>
                <TableCell>Projekt</TableCell>
                <TableCell>Tytuł</TableCell>
                <TableCell>Kwota</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Edycja</TableCell>
                <TableCell>Usuwanie</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salaries.map((salary, i) => {
                if (!salary.projectId){
                  salary.projectId = {name: ''}
                }
                if (!salary.userId){
                  salary.userId = {name: '', surname: ''}
                }
                return (
                  <TableRow key={i}>
                    <TableCell>{i+1}</TableCell>
                    <TableCell>{salary.userId.name} {salary.userId.surname}</TableCell>
                    <TableCell>{salary.projectId.name}</TableCell>
                    <TableCell>{salary.title}</TableCell>
                    <TableCell>{salary.amount.toFixed(2)} zł</TableCell>
                    <TableCell>
                      <Moment format="YYYY/MM/DD hh:mm">
                        {salary.date}
                      </Moment>
                    </TableCell>
                    <TableCell>

                      {/* edycja */}
                      <Button size ='small' color="primary" aria-label="edit" style={{width:'35px', height:'23px'}} disabled="true" href={'/app/editSalaries/' +`${salary._id}`} >
                        <ModeEditIcon />
                      </Button>

                    </TableCell>
                    <TableCell>

                      {/* usuwanie  */}
                      <Button size ='small' color="secondary" aria-label="delete" style={{width:'35px', height:'23px'}} disabled="true" onClick={() => this.handleOpen(salary._id)}>
                        <DeleteIcon />
                      </Button>

                    </TableCell>
                  </TableRow>
                );
              })}
                <Dialog
                    open={this.state.openDialog}
                    onClose={this.handleClose}
                  >
                  <DialogTitle>{"Czy na pewno chcesz usunąć tą wypłatę?"}</DialogTitle>
                  <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                      Anuluj
                    </Button>
                    <Button onClick={() => this.deleteFunction(this.state.selectedSalary)} color="secondary" autoFocus>
                      Usuń
                    </Button>
                  </DialogActions>
                </Dialog>
            </TableBody>
          </Table>
        </Paper>
        </div>
      );
    }   
  }
}

export default withStyles(styles)(GetSalaries);