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
import Moment from 'react-moment';
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

class GetProjectSalaries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      salaries: [],
      openDialog: false,
    }
  }
  componentDidMount() {
    fetch('https://reactmanagebe.herokuapp.com/api/salaries/projects/' + this.props.match.params.id, {
      credentials: 'include'
    }).then( response => response.json())
      .then( data => this.setState({salaries: data.salaries, logged: data.logged}))
      .then( () => this.setState({isLoading: false}))
      .catch( err => {
        if (err == 'TypeError: Failed to fetch') return this.setState({redirectLogin: true})
      })
  }

  render () {
    const { isLoading } = this.state
    const { salaries } = this.state
    const { logged } = this.state

    if (isLoading) {
      return <CircularProgress style={{
        'width': '60px',
        'height': '40px',
        'margin-left': '44%',
        'margin-top': '24%'
      }}/>
    }
    return (
      <div style={{marginTop:'-5%', marginLeft: '162px', marginRight: '40px'}}>
        <div style={{marginLeft: '-5%', marginBottom: '-2%'}}>
          <Typography variant = 'headline' align='center'> Wypłaty: </Typography>
        </div>

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

export default withStyles(styles)(GetProjectSalaries);