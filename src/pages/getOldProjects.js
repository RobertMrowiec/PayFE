import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import ModeEditIcon from 'material-ui-icons/ModeEdit';
import Typography from 'material-ui/Typography';
import DeleteIcon from 'material-ui-icons/Delete';
import { Redirect } from 'react-router-dom';
import { CircularProgress } from 'material-ui/Progress';
import Dialog, {
  DialogActions,
  DialogTitle
} from 'material-ui/Dialog';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  }
});

class GetOldProjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      selectedProject: '',
      isAdmin: false
    }
  }

  deleteFunction (project) {    
    fetch('https://reactmanagebe.herokuapp.com/api/projects/' + project,{
      method: 'delete',
      credentials:'include'
    }).then(() => {
      this.setState({projects: this.state.projects.filter(f => f._id !== project)});
      this.setState({openDialog: false})
    })
  }

  componentDidMount() {
    this.setState({isLoading: true})
    fetch('https://reactmanagebe.herokuapp.com/api/projects?old=true', {
      credentials: 'include'
    }).then( response => response.json())
      .then( data => {
        this.setState({
        projects: data.projects,
        logged: data.logged
        })
        if (data.logged.isAdmin == true) {
          this.setState({isAdmin: true})
        }
      })
      .then( () => this.setState({isLoading: false}))
      .catch(err => {
        if (err == 'TypeError: Failed to fetch') return this.setState({redirectLogin: true})
      })
  }
  handleOpen = (project) => {
    this.setState({ selectedProject: project})
    this.setState({ openDialog: true });
  };

  handleClose = () => {
    this.setState({ openDialog: false });
  };

  redirectFunction (project) {
    this.setState({projectId: project._id})
    this.setState({redirect: true})
  }

  redirectToSalaryFunction (project) {
    this.setState({projectId: project._id})
    this.setState({redirectToSalary: true})
  }

  render () {
    const { redirectLogin } = this.state
    const { isLoading } = this.state
    const { projects } = this.state
    const { isAdmin } = this.state
    const { redirect } = this.state
    const { redirectToSalary } = this.state
    
    if (redirect) {
      return (
        <Redirect to={{pathname: '/app/projectInfo/' + `${this.state.projectId}` }}/>
      )
    }

    if (redirectToSalary) {
      return (
        <Redirect to={{pathname: '/app/projectInfo/salaries/' + `${this.state.projectId}` }} />
      )
    }

    if (isLoading) {
      return <CircularProgress style={{
        'width': '75px',
        'margin-left': '47%',
        'margin-top': '5%'
      }}/>
    }

    if (redirectLogin) {
      return (
        <Redirect to={{pathname: '/login' }}/>
      )
    }
    
    if (isAdmin == true){
      if (projects.length > 0) {
        return (
          <div style={{marginTop:'-5%', marginLeft: '162px', marginRight: '40px'}}>
  
            <div style={{marginLeft: '-5%', marginBottom: '-2%'}}>
              <Typography variant = 'headline' align='center'> Stare projekty: </Typography>
            </div>
  
            <div style = {{marginLeft: '94%', marginBottom: '0.5%'}}>
              <Button fab mini color="primary" aria-label="add" className={styles.button} component={Link} to="/app/addProjects">
                <AddIcon/>
              </Button>
            </div>
            
            <Paper className={styles.root}>
              <Table className={styles.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nazwa</TableCell>
                    <TableCell>Kwota</TableCell>
                    <TableCell>Ile pozostało</TableCell>
                    <TableCell>Ile pozostało potencjalnie</TableCell>
                    <TableCell>Ilość programistów</TableCell>
                    <TableCell>Ilość wypłat</TableCell>
                    <TableCell>Edycja</TableCell>
                    <TableCell>Usuwanie</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.map((project, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell onClick={ () => this.redirectFunction(project)}> {project.name} </TableCell> 
                        <TableCell onClick={ () => this.redirectFunction(project)}> {project.amount.toFixed(2)} zł </TableCell>
                        <TableCell onClick={ () => this.redirectFunction(project)}> {project.howmany.toFixed(2)} zł </TableCell>
                        <TableCell onClick={ () => this.redirectFunction(project)}> {project.howmanyPotentially.toFixed(2)} zł </TableCell>
                        <TableCell onClick={ () => this.redirectFunction(project)}> {project.peoples} </TableCell>
                        <TableCell onClick={ () => this.redirectToSalaryFunction(project)}> {project.salaries} </TableCell>
                        <TableCell>
  
                          {/* edycja */}
                          <Button size='small' color="primary" aria-label="edit" style={{width:'35px', height:'23px'}} href={'/app/editProjects/' +`${project._id}`}>
                            <ModeEditIcon />
                          </Button>
  
                        </TableCell>
                        <TableCell>
                          
                          {/* usuwanie  */}
                          <Button size='small' color="secondary" aria-label="delete" style={{width:'35px', height:'23px'}} onClick={() => this.handleOpen(project._id)}>
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
                    <DialogTitle>{"Czy na pewno chcesz usunąć ten projekt?"}</DialogTitle>
                    <DialogActions>
                      <Button onClick={() => this.handleClose()} color="primary">
                        Anuluj
                      </Button>
                      <Button onClick={() => this.deleteFunction(this.state.selectedProject)}
                        color="secondary" autoFocus>
                        Usuń
                      </Button>
                    </DialogActions>
                  </Dialog>
                </TableBody>
              </Table>
            </Paper>
          </div>
        )
      } else {
        return (
          <div style={{marginTop:'-5%', marginLeft: '162px', marginRight: '40px'}}>
  
            <div style={{marginLeft: '-5%', marginBottom: '-2%'}}>
              <Typography variant = 'headline' align='center'> Projekty: </Typography>
            </div>
  
            <div style = {{marginLeft: '94%', marginBottom: '0.5%'}}>
              <Button fab mini color="primary" aria-label="add" className={styles.button} component={Link} to="/app/addProjects">
                <AddIcon />
              </Button>
            </div>
  
            <Paper className={styles.root}>
              <Table className={styles.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nazwa</TableCell>
                    <TableCell>Kwota</TableCell>
                    <TableCell>Ile pozostało</TableCell>
                    <TableCell>Ilość programistów</TableCell>
                    <TableCell>Ilość wypłat</TableCell>
                    <TableCell>Edycja</TableCell>
                    <TableCell>Usuwanie</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.map((project, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{project.name}</TableCell> 
                        <TableCell>{project.amount.toFixed(2)} zł</TableCell>
                        <TableCell>{project.howmany.toFixed(2)} zł</TableCell>
                        <TableCell>{project.peoples}</TableCell>
                        <TableCell>{project.salaries}</TableCell>
                        <TableCell>
  
                          {/* edycja */}
                          <Button size='small' color="primary" aria-label="edit" style={{width:'35px', height:'23px'}} disabled='true' href={'/app/editProjects/' +`${project._id}`}>
                            <ModeEditIcon />
                          </Button>
  
                        </TableCell>
                        <TableCell>
                          
                          {/* usuwanie  */}
                          <Button size='small' color="secondary" aria-label="delete" style={{width:'35px', height:'23px'}} disabled='true' onClick={() => this.handleOpen(project._id)}>
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
                    <DialogTitle>{"Czy na pewno chcesz usunąć ten projekt?"}</DialogTitle>
                    <DialogActions>
                      <Button onClick={() => this.handleClose()} color="primary">
                        Anuluj
                      </Button>
                      <Button onClick={() => this.deleteFunction(this.state.selectedProject)}
                        color="secondary" autoFocus>
                        Usuń
                      </Button>
                    </DialogActions>
                  </Dialog>
                </TableBody>
              </Table>
            </Paper>
          </div>
        )
      }
    } else {
      return (
        <div style={{marginLeft: '5%', marginBottom: '-2%'}}>
          <Typography variant = 'display1' align='center'> Nie posiadasz uprawnień do przeglądania starych projektów.</Typography>
        </div>
      )  
    }
  }
}

export default withStyles(styles)(GetOldProjects);