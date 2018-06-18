import React, {Component} from 'react';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import ModeEditIcon from 'material-ui-icons/ModeEdit';
import DeleteIcon from 'material-ui-icons/Delete';
import { Redirect } from 'react-router-dom';
import Dialog, {
  DialogActions,
  DialogTitle,
} from 'material-ui/Dialog';
import { Link } from 'react-router-dom';  
import Typography from 'material-ui/Typography';
import { CircularProgress } from 'material-ui/Progress';

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

class GetUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      openDialog: false,
      selectedUser: '',
      userId: ''
    }
  }

  deleteFunction (user, e) {
    fetch('https://reactmanagebe.herokuapp.com/api/users/' + user,{
      method: 'delete',
      credentials: 'include'
    }).then(() => {
      this.setState({users: this.state.users.filter(f => f._id !== user)});
      this.setState({openDialog: false})
    })
  }

  redirectFunction (user) {
    this.setState({userId: user._id})
    this.setState({redirect: true})
  }

  componentDidMount() {
    fetch('https://reactmanagebe.herokuapp.com/api/users', {credentials: 'include'})
      .then( response => response.json())
      .then( data => {
        this.setState({logged: data.logged})
        this.setState({users: data.users})
        if (data.logged.isAdmin == true) {
          this.setState({isAdmin: true})
        }
        else {
          this.setState({isAdmin: false})
          
        }
      })
      .then(() => this.setState({isLoading: false}))
      .catch(err => {
        if (err == 'TypeError: Failed to fetch') return this.setState({redirectLogin: true})
      })
  }
  handleOpen = (user) => {
    this.setState({ selectedUser: user})
    this.setState({ openDialog: true });
  };

  handleClose = () => {
    this.setState({ openDialog: false });
  };

  disableButtonFunction() {
    console.log(this.state.isAdmin);
    
    if (this.state.isAdmin == false || !this.state.isAdmin){
      return(
        <div style = {{marginLeft: '94%', marginBottom: '0.5%'}}>
          <Button size='small' color="primary" aria-label="add" className={styles.button} disabled="true" component={Link} to="/app/addUsers">
            <AddIcon />
          </Button>
        </div>
      )
    }
    else {
      return(
        <div style = {{marginLeft: '94%', marginBottom: '0.5%'}}>
          <Button size='small' color="primary" aria-label="add" className={styles.button} component={Link} to="/app/addUsers">
            <AddIcon />
          </Button>
        </div>
      )
    }      
  }

  render () {
    
    const { users } = this.state;
    const { redirect } = this.state
    const { redirectLogin } = this.state
    const { isLoading } = this.state
    const { logged } = this.state
    
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
    
    if (redirect) {
      return (
        <Redirect to={{pathname: '/app/userInfo/' + `${this.state.userId}` }}/>
      )
    }

    return (
      <div style={{marginTop:'-5%', marginLeft: '162px', marginRight: '20px'}}>
      <div style={{marginLeft: '-5%', marginBottom: '-2%'}}>
          <Typography variant = 'headline' align='center'> Programiści: </Typography>
        </div>
        
        {this.disableButtonFunction()}

      <Paper className={styles.root}>
        <Table className={styles.table}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Imie</TableCell>
              <TableCell>Nazwisko</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Ilość projektów</TableCell>
              <TableCell>Edycja</TableCell>
              <TableCell>Usuwanie</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, i) => {
              if (logged.isAdmin == true) {
                return (
                  <TableRow key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell onClick={ () => this.redirectFunction(user)} >{user.name}</TableCell> 
                    <TableCell onClick={ () => this.redirectFunction(user)} >{user.surname}</TableCell>
                    <TableCell onClick={ () => this.redirectFunction(user)} >{user.email}</TableCell>
                    <TableCell onClick={ () => this.redirectFunction(user)} >{user.projects.length}</TableCell>
                    <TableCell>
  
                      {/* edycja */}
                      <Button size='small' color="primary" aria-label="add" style={{width:'35px', height:'23px'}} href={'/app/editUsers/' +`${user._id}`} >
                        <ModeEditIcon />
                      </Button>
  
                    </TableCell>
                    <TableCell>
  
                      {/* usuwanie  */}
                      <Button size='small' color="secondary" aria-label="add" style={{width:'35px', height:'23px'}} onClick={() => this.handleOpen(user._id)}>
                        <DeleteIcon />
                      </Button>
  
                    </TableCell>
                  </TableRow>
                )
              }
              else if (logged._id.toString() == user._id.toString()){
                return (
                  <TableRow key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{user.name}</TableCell> 
                    <TableCell>{user.surname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.projects.length}</TableCell>
                    <TableCell>
  
                      {/* edycja */}
                      <Button size='small' color="primary" aria-label="add" style={{width:'35px', height:'23px'}} href={'/app/editUsers/' +`${user._id}`} >
                        <ModeEditIcon />
                      </Button>
  
                    </TableCell>
                    <TableCell>
  
                      {/* usuwanie  */}
                      <Button size='small' color="secondary" aria-label="add" disabled="true" style={{width:'35px', height:'23px'}}>
                        <DeleteIcon />
                      </Button>
  
                    </TableCell>
                  </TableRow>
                )
              }
              else {
                return (
                  <TableRow key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{user.name}</TableCell> 
                    <TableCell>{user.surname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.projects.length}</TableCell>
                    <TableCell>

                      {/* edycja */}
                      <Button size='small' color="primary" aria-label="add" style={{width:'35px', height:'23px'}} href={'/app/editUsers/' +`${user._id}`} disabled="true">
                        <ModeEditIcon />
                      </Button>

                    </TableCell>
                    <TableCell>

                      {/* usuwanie  */}
                      <Button size='small' color="secondary" aria-label="add" style={{width:'35px', height:'23px'}} onClick={() => this.handleOpen(user._id)} disabled="true">
                        <DeleteIcon />
                      </Button>

                    </TableCell>
                  </TableRow>
                );
              }
            })}
            <Dialog
              open={this.state.openDialog}
              onClose={this.handleClose}
            >
              <DialogTitle>{"Czy na pewno chcesz usunąć tego uzytkownika?"}</DialogTitle>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Anuluj
                </Button>
                <Button onClick={() => this.deleteFunction(this.state.selectedUser)} color="secondary" autoFocus>
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

export default withStyles(styles)(GetUsers);