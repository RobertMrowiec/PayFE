import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import ModeEditIcon from 'material-ui-icons/ModeEdit';
import DeleteIcon from 'material-ui-icons/Delete';
import Typography from 'material-ui/Typography';
import Moment from 'react-moment';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class GetSalaries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      salaries: []
    }
  }

  deleteFunction (salary, e) {
    fetch('https://reactmanagebe.herokuapp.com/api/salaries/' + salary._id,{
      method: 'delete'
    }).then(() => {
      this.setState({salaries: this.state.salaries.filter(f => f._id !== salary._id)});
      // this.setState({openDialog: false})
    })
  }

  componentDidMount() {
    fetch('https://reactmanagebe.herokuapp.com/api/salaries')
      .then( response => response.json())
      .then( data => this.setState({salaries: data}))
  }
  render () {
    const {salaries} = this.state;
      
    return (
      <div>
        <div style={{marginLeft: '-5%', marginBottom: '-2%'}}>
          <Typography variant = 'headline' align='center'> Wypłaty: </Typography>
        </div>

        <div style = {{marginLeft: '94%', marginBottom: '0.5%'}}>
          <Button fab mini color="primary" aria-label="add" className={styles.button} component={Link} to="/addSalaries">
            <AddIcon />
          </Button>
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
                    <Button fab mini color="primary" aria-label="add" style={{width:'35px', height:'23px'}} href={'/editSalaries/' +`${salary._id}`} >
                      <ModeEditIcon style = {{width:'60%', height:'60%'}}/>
                    </Button>

                  </TableCell>
                  <TableCell>

                    {/* usuwanie  */}
                    <Button fab mini color="accent" aria-label="add" style={{width:'35px', height:'23px'}} onClick={() => {this.deleteFunction(salary)}} >
                      <DeleteIcon style = {{width:'60%', height:'60%'}}/>
                    </Button>

                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(GetSalaries);