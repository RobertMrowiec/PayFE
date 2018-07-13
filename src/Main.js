import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import Default from './pages/Default';
import GetProjects from './pages/getProjects';
import GetProjectInfo from './pages/getProjectInfo';
import AddProjects from './pages/AddProjects';
import EditProjects from './pages/EditProjects';
import GetUsers from './pages/getUsers';
import GetUserInfo from './pages/getUserInfo';
import AddUsers from './pages/AddUsers';
import EditUsers from './pages/EditUsers';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import GetSalaries from './pages/getSalaries';
import AddSalaries from './pages/AddSalaries';
import EditSalaries from './pages/EditSalaries';
import LokomotywaTomek from './pages/LokomotywaTomek';
import GetProjectSalaries from './pages/getProjectSalaries';
import GetOldProjects from './pages/getOldProjects';

const styles = theme => ({
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
});

injectTapEventPlugin();

class App extends Component {
    constructor(props) {
        super(props);
    }
    toggleDrawer = (open) => () => {
      this.setState({
        left: open,
      });
    };
  
    handleToggle = () => this.setState({isDrawerOpen: true});
    closeDrawer = () => this.setState({ isDrawerOpen: false });

    handleChange = event => {
      this.setState({
        anchor: event.target.value,
      });
    };

    handleDrawerToggle = () => {
      this.setState({ mobileOpen: !this.state.mobileOpen });
    };
  
    handleDrawerToggle = () => {
      this.setState({ mobileOpen: !this.state.mobileOpen });
    };
  
    render() {
      const { classes } = this.props;
      
      return (
        <div>

          <Router>
            <div style={{marginTop:'90px', paddingLeft: '20px'}}>
              <Route exact path="/login" component={Login} />
              <Route exact path="/" component={Default}/>
              <Route path="/app" component={Home} />
              <Route path="/app/dashboard" component={Dashboard} />
              <Route path="/app/lokomotywaTomek" component={LokomotywaTomek} />
              <Route exact path="/app/projects" component={GetProjects} />
              <Route exact path="/app/projects/old" component={GetOldProjects} />
              <Route exact path="/app/projectInfo/:id" component={GetProjectInfo} />
              <Route exact path="/app/projectInfo/salaries/:id" component={GetProjectSalaries} />
              <Route path="/app/addProjects" component={AddProjects} />
              <Route path="/app/editProjects/:id" component={EditProjects} />
              <Route exact path="/app/users" component={GetUsers} />
              <Route path="/app/userInfo/:id" component={GetUserInfo} />
              <Route path="/app/addUsers" component={AddUsers} />
              <Route path="/app/editUsers/:id" component={EditUsers} />
              <Route path="/app/salaries" component={GetSalaries} />
              <Route path="/app/addSalaries" component={AddSalaries} />
              <Route path="/app/editSalaries/:id" component={EditSalaries} />
            </div>
          </Router>

        </div>
      );
    }

}
App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);