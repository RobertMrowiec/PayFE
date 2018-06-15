import React, {Component} from 'react';
import classNames from 'classnames';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu'; 
import injectTapEventPlugin from 'react-tap-event-plugin';
import { ListItem, ListItemText } from 'material-ui/List';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';  



import GetProjects from './pages/getProjects';
import AddProjects from './pages/AddProjects';
import EditProjects from './pages/EditProjects';
import GetUsers from './pages/getUsers';
import GetUserInfo from './pages/getUserInfo';
import AddUsers from './pages/AddUsers';
import EditUsers from './pages/EditUsers';
import Home from './pages/Home';
import GetSalaries from './pages/getSalaries';
import AddSalaries from './pages/AddSalaries';
import EditSalaries from './pages/EditSalaries';
import Button from 'material-ui/Button';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    marginLeft: '11%',
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    // position: 'relative',
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
  
    render() {
      const { classes, theme } = this.props;

      return (
        <div>
          <div className={classes.root}>
            <AppBar position="absolute" className={classes.appBar}>
              <Toolbar>
                <Typography type="title" color="inherit" noWrap>
                 <Button className={classes.button} href='/'> Surprise.Design </Button>
                </Typography>
              </Toolbar>
            </AppBar>
            
            <Drawer variant="permanent" className={classes.drawer}>
            <div className={classes.toolbar} />
              <ListItem button component="a" href="/users">
                <ListItemText primary="Uzytkownicy" />
              </ListItem>

              <ListItem button component="a" href="/projects">
                <ListItemText primary="Projekty" />
              </ListItem>
              
              <ListItem button component="a" href="/salaries">
                <ListItemText primary="Wypłaty" />
              </ListItem>  
            </Drawer>

            <Router>
              <div style={{marginTop:'90px', width:'100%', marginLeft:'0.9%', marginRight:'0.9%'}}>
                <Route exact path="/" component={Home} />
                <Route path="/projects" component={GetProjects} />
                <Route path="/addProjects" component={AddProjects} />
                <Route path="/editProjects/:id" component={EditProjects} />
                <Route path="/users" component={GetUsers} />
                <Route path="/userInfo/:id" component={GetUserInfo} />
                <Route path="/addUsers" component={AddUsers} />
                <Route path="/editUsers/:id" component={EditUsers} />
                <Route path="/salaries" component={GetSalaries} />
                <Route path="/addSalaries" component={AddSalaries} />
                <Route path="/editSalaries/:id" component={EditSalaries} />
              </div>
            </Router>

          </div>
            
        </div>
      );
    }

}
App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);