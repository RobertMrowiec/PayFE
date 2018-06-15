import React, {Component} from 'react';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from "material-ui/Form";
import { InputLabel } from "material-ui/Input";
import Select from 'material-ui/Select';
import { Redirect } from 'react-router-dom';
import { CircularProgress } from 'material-ui/Progress';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  rootChip: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: theme.spacing.unit / 2,
    marginLeft: '51%',
    marginTop: '-120px',
    marginBottom: '125px'
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
  },
  card: {
    width: '50%'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  pos: {
    marginBottom: 12,
    color: theme.palette.text.secondary,
  },
  chip: {
    margin: theme.spacing.unit / 2,
  },
});

class GetUserInfo extends Component {
    state = {
      name:'',
      surname:'',
      email:'',
      projects: [],
      value: 1,
      age: '',
      salaries: [],
      chipData: []
  }

  componentDidMount() {
    fetch('https://reactmanagebe.herokuapp.com/api/users/' + this.props.match.params.id, {credentials: 'include'})
      .then( response => response.json())
      .then( data => this.setState({
        name: data.name,
        surname: data.surname,
        email: data.email,
        projects: data.projects,
        chipData: data.projects,
      }),
      )
      .then(() => {
        fetch('https://reactmanagebe.herokuapp.com/api/salaries/user/' + this.props.match.params.id, {credentials: 'include'})
        .then( response => response.json())
        .then( salaryData => this.setState({salaries: salaryData}))
      })
      .then(() => this.setState({isLoading: false}))
      .catch(err => {
        if (err == 'TypeError: Failed to fetch') return this.setState({redirectLogin: true})
      })
  }

  changeSalary = event => {
    this.setState({ age: event.target.value});
    fetch('https://reactmanagebe.herokuapp.com/api/salaries/user/' + this.props.match.params.id + '/date/' + event.target.value, {credentials: 'include'})
    .then( response => response.json())
    .then( salaryData => this.setState({salaries: salaryData}))
  };

  handleDelete = data => () => {
    fetch('https://reactmanagebe.herokuapp.com/api/users/' + this.props.match.params.id + '/projects/' + data._id,{
      method: 'delete',
      credentials: 'include'
    }).then(() => {
      this.setState({chipData: this.state.chipData.filter(f => f._id !== data._id)});
    })
  };


  render () {
    const { classes } = this.props;
    const { salaries } = this.state;
    const { redirectLogin } = this.state
    const { isLoading } = this.state

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
    return (
      <div style={{marginTop:'-5%', marginLeft: '162px', marginRight: '40px'}}>
          <Card style = {{width: '50%'}}>
            <CardContent>
              <Typography>Dane uzytkownika:</Typography>
              <Typography type="headline" component="h3">
                {this.state.name} {this.state.surname}
              </Typography>
              <Typography >Adres email</Typography>
              <Typography>
                {this.state.email}
              </Typography>
            </CardContent>
          </Card>

          <Paper className={classes.rootChip}>
          {this.state.chipData.map(data => {
            return (
              <Chip
                key={data._id}
                label={data.name}
                onDelete={this.handleDelete(data)}
                className={classes.chip}
                />
              );
            })}
          </Paper>
          
          <FormControl className={classes.formControl}>
          <InputLabel htmlFor="age-simple">Data</InputLabel>
            <Select
              value={this.state.age}
              onChange={this.changeSalary}
              displayEmpty
              name="age"
              className={classes.selectEmpty}
            >
              <MenuItem value={7}>
                <em>7 dni</em>
              </MenuItem>
              <MenuItem value={30}>Miesiąc</MenuItem>
              <MenuItem value={365}>Rok</MenuItem>
              <MenuItem value={0}>Całość</MenuItem>
            </Select>
          </FormControl>

          <Paper className={styles.root}>
            <Table className={styles.table}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Kwota</TableCell>
                  <TableCell>Projekt</TableCell>
                  <TableCell>Data</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salaries.map((salary, i) => {
                  if (salary.projectId != null){
                    return (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{salary.amount.toFixed(2)} zł</TableCell> 
                        <TableCell>{salary.projectId.name}</TableCell>
                        <TableCell>{salary.date}</TableCell>
                      </TableRow>
                    );
                  }
                  else {
                    return (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{salary.amount.toFixed(2)} zł</TableCell> 
                        <TableCell></TableCell>
                        <TableCell>{salary.date}</TableCell>
                      </TableRow>
                    );
                  }
                })}
              </TableBody>
            </Table>
          </Paper>
        </div>
    );
  }
}

export default withStyles(styles)(GetUserInfo);