import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { Redirect } from 'react-router-dom';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';

const styles = theme => ({
  typo: {
    'marginLeft': '30%',
    'marginTop': '20%'
  },
  root: {
    marginLeft: '8%',
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    display: 'flex',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  button: {
    color: 'white',
    size: 'large',
    margin: theme.spacing.unit,
  },
  buttonLogout: {
    color: 'white',
    size: 'large',
    marginLeft: '86%',
  },
  drawer: {
    position: 'relative',
    marginTop: '5%',
  },
  toolbar: theme.mixins.toolbar
})

class Home extends Component {
  constructor(props) {
      super(props);
      this.state = {
          users: [],
          salaries: []
      }
  }

  componentDidMount() {
    this.setState({isLoading: true})
    return Promise.all([
      this.actualMonth(),
      this.monthAgo(),
      this.twoMonthsAgo(),
      this.projectsActualMonth(),
      this.projectsMonthAgo(),
      this.projectsTwoMonthsAgo()
    ]).then(() => this.setState({isLoading: false}))
  }
  
  actualMonth() {
    return fetch('https://reactmanagebe.herokuapp.com/api/dashboards/salaries', {credentials: 'include'})
      .then( response => response.json())
      .then( data => {
        if (!data.imiona){
          return this.setState({sum: data.sum, sumData: true})
        }
        else {
          return this.setState({users: data.imiona, potentiallySalaries: data.potencjalne, salaries: data.sumy, sumData: false})
        }
      })
      .catch(err => {
        if (err == 'TypeError: Failed to fetch') return this.setState({redirectLogin: true})
      })
  }

  monthAgo() {
    return fetch('https://reactmanagebe.herokuapp.com/api/dashboards/salaries/months/one', {credentials: 'include'})
      .then( response => response.json())
      .then( data => {
        return this.setState({usersMonthAgo: data.imiona, potentiallySalariesMonthAgo: data.potencjalne, salariesMonthAgo: data.sumy, sumDataMonthAgo: false})
      })
      .catch(err => {
        if (err == 'TypeError: Failed to fetch') return this.setState({redirectLogin: true})
      })
  }

  twoMonthsAgo() {
    return fetch('https://reactmanagebe.herokuapp.com/api/dashboards/salaries/months/two', {credentials: 'include'})
      .then( response => response.json())
      .then( data => {
        return this.setState({usersTwoMonthsAgo: data.imiona, potentiallySalariesTwoMonthsAgo: data.potencjalne, salariesTwoMonthsAgo: data.sumy, sumDataTwoMonthsAgo: false})
      })
      .catch(err => {
        if (err == 'TypeError: Failed to fetch') return this.setState({redirectLogin: true})
      })
  }

  projectsActualMonth() {
    return fetch('https://reactmanagebe.herokuapp.com/api/dashboards/projects', {credentials: 'include'})
      .then( response => response.json())
      .then( data => {
        return this.setState({projectsList: data})
      })
      .catch(err => {
        if (err == 'TypeError: Failed to fetch') return this.setState({redirectLogin: true})
      })
  }

  projectsMonthAgo() {
    return fetch('https://reactmanagebe.herokuapp.com/api/dashboards/projects/months/one', {credentials: 'include'})
      .then( response => response.json())
      .then( data => {
        return this.setState({projectsListMonthAgo: data})
      })
      .catch(err => {
        if (err == 'TypeError: Failed to fetch') return this.setState({redirectLogin: true})
      })
  }

  projectsTwoMonthsAgo() {
    return fetch('https://reactmanagebe.herokuapp.com/api/dashboards/projects/months/one', {credentials: 'include'})
      .then( response => response.json())
      .then( data => {
        return this.setState({projectsListTwoMonthsAgo: data})
      })
      .catch(err => {
        if (err == 'TypeError: Failed to fetch') return this.setState({redirectLogin: true})
      })
  }

  render(){

    const dashboardData = (labels, firstLabel, firstData, secondLabel, secondData) => {
      return {
        labels: labels,
        datasets: [{
          label: firstLabel,
          data: firstData,
          backgroundColor: 'rgba(103,220,114, 0.2)',
          borderColor: 'rgba(103,220,114, 0.2)',
        },
        {
          label: secondLabel,
          data: secondData,
        }]
      }
    }

    const ChangePage = (side, status) => {
      let page = {}
      page['page' + side] = status
      this.setState({page})
    }    

    const Result = (actualState) => {

      if (actualState.redirectLogin) {
        return <Redirect to={{pathname: '/login' }}/>
      }

      if (actualState.isLoading) {
        return (
        <CircularProgress style={{
          'width': '60px',
          'height': '40px',
          'margin-left': '44%',
          'margin-top': '24%'
        }}/>
        )
      }

      if (actualState.sumData) {
        return (
          <div style={{textAlign:'center', marginTop:'15%'}}>
            <Typography variant = 'display2' className={styles.typo}> W tym miesiącu zarobiłeś: {actualState.sum.toFixed(2)} zł </Typography>
          </div>
        )
      }

      if (actualState.page && actualState.page.pageProjects){
        return (
          <div>
            <div>
              <Button style={{float:'left', size: "10px"}} color="primary" onClick={() => ChangePage('ProjectsMonthAgo', true)}>
                Poprzedni miesiąc
              </Button>
              <Button color="primary" style={{float:'right'}} onClick={() => ChangePage('Dashboard', true)}> Dashboard </Button> 
              <Button color="primary" style={{float:'right'}} onClick={() => ChangePage('Developers', true)}> Programiści </Button> 
              <br/>
              <br/>
              <br/>
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nazwa</TableCell>
                      <TableCell>Suma</TableCell>
                      <TableCell>Ilość wypłat</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.projectsList.map((project, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell> {project.name} </TableCell> 
                          <TableCell> {project.sum.toFixed(2)} zł </TableCell>
                          <TableCell> {project.count} </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </Paper>
            </div>
          </div>
        )
      }

      if (actualState.page && actualState.page.pageProjectsMonthAgo){
        return (
          <div>
            <div>
              <Button style={{float:'left', size: "10px"}} color="primary" onClick={() => ChangePage('ProjectsTwoMonthsAgo', true)}>
                Miesiąc w tył
              </Button>
              <Button style={{float:'right', size: "10px"}} color="primary" onClick={() => ChangePage('Projects', true)}>
                Aktualny miesiąc
              </Button>
              <br/>
              <br/>
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nazwa</TableCell>
                      <TableCell>Suma</TableCell>
                      <TableCell>Ilość wypłat</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.projectsListMonthAgo.map((project, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell> {project.name} </TableCell> 
                          <TableCell> {project.sum.toFixed(2)} zł </TableCell>
                          <TableCell> {project.count} </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </Paper>
            </div>
          </div>
        )
      }

      if (actualState.page && actualState.page.pageProjectsTwoMonthsAgo){
        return (
          <div>
            <div>
              <Button style={{float:'right', size: "10px"}} color="primary" onClick={() => ChangePage('ProjectsMonthAgo', true)}>
                Miesiąc w przód
              </Button>
              <br/>
              <br/>
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nazwa</TableCell>
                      <TableCell>Suma</TableCell>
                      <TableCell>Ilość wypłat</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.projectsListTwoMonthsAgo.map((project, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell> {project.name} </TableCell> 
                          <TableCell> {project.sum.toFixed(2)} zł </TableCell>
                          <TableCell> {project.count} </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </Paper>
            </div>
          </div>
        )
      }
      if (actualState.page && actualState.page.pageDoubleLeft){
        return (
          <div>
            <div>
              <Button style={{float:'right', size:"10px"}} color="primary" onClick={() => ChangePage('Left', true)}>
                Miesiąc w przód
              </Button>
            </div>
          
            <Line data={dashboardData(actualState.users, 'Zarobki dwa miesiące temu', actualState.salariesTwoMonthsAgo, 'Potencjalne zarobki dwa miesiące temu', actualState.potentiallySalariesTwoMonthsAgo)} height={140}/>
          </div>
        )
      }

      if (actualState.page && actualState.page.pageLeft){
        return (
          <div>
            <div>
              <Button color="primary" style={{float:'left'}} onClick={() => ChangePage('DoubleLeft', true)}> Miesiąc w tył </Button> 
              <Button color="primary" style={{float:'right'}} onClick={() => ChangePage('Left', false)}> Aktualny miesiąc </Button>
            </div>
          
            <Line data={dashboardData(actualState.users, 'Zarobki miesiąc temu', actualState.salariesMonthAgo, 'Potencjalne zarobki miesiąc temu', actualState.potentiallySalariesMonthAgo)} height={140}/>
          </div>
        )
      }
      
      return (
        <div>
          <div>
            <Button color="primary" style={{float:'left'}} onClick={() => ChangePage('Left', true)}> Miesiąc w tył </Button> 
            <Button color="primary" style={{float:'right'}} onClick={() => ChangePage('Projects', true)}> Projekty </Button> 
            <Button color="primary" style={{float:'right'}} onClick={() => ChangePage('Developers', true)}> Programiści </Button> 
          </div>
          
          <Line data={dashboardData(actualState.users, "Zarobki z tego miesiąca", actualState.salaries, 'Potencjalne zarobki z tego miesiąca', actualState.potentiallySalaries)} height={140}/>
        </div>
      )
    }
      return (
        <div style={{paddingLeft: '150px', marginTop: '-6%', width:'91.5%'}}>
          <Typography variant = 'display3' align='center'> Dashboard </Typography>

          {Result(this.state)}

        </div>
      )
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Home)
