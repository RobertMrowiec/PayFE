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


class GetSalaries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      salaries: [],
      openDialog: false,
      selectedSalary: ''
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
    fetch('https://reactmanagebe.herokuapp.com/api/salaries', {
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
          <Button color="primary" aria-label="add" className={styles.button} component={Link} to="/app/addSalaries" disabled="true">
            <AddIcon />
          </Button>
        </div>
      )
    }
    return(
      <div style = {{marginLeft: '94%', marginBottom: '0.5%'}}>
        <Button color="primary" aria-label="add" className={styles.button} component={Link} to="/app/addSalaries">
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