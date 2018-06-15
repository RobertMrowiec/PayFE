import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';
import { List, ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import Button from 'material-ui/Button';
import ExpandMore from 'material-ui-icons/ExpandMore';

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
    width: '100%',
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

  render(){
    const { classes } = this.props

      return (
        <div>
          <div className={classes.root}>
            <AppBar position="absolute" className={classes.appBar}>
              <Toolbar>
                <Typography type="title" color="inherit" noWrap style={{width:'100%'}}>
                  <Button className={classes.button} href='/app/dashboard/'> Surprise.Design </Button>
                </Typography>
                <Typography type="title" color="inherit" noWrap>
                  <Button className={classes.button} href='/login'> Wyloguj </Button>
                </Typography>
              </Toolbar>
            </AppBar>
            
            <Drawer variant="permanent" className={classes.drawer}>
            <div className={classes.toolbar} />
              <ListItem button component="a" href="/app/users">
                <ListItemText primary="Uzytkownicy" />
              </ListItem>

              <ListItem button component="a" href="/app/projects">
                <ListItemText primary="Projekty" />
              </ListItem>
              
              <ListItem button component="a" href="/app/projects/old">
                <ListItemText primary="Stare projekty" />
              </ListItem>

              <ListItem button component="a" href="/app/salaries">
                <ListItemText primary="Wypłaty" />
              </ListItem>

              <ListItem button component="a" href="/app/lokomotywaTomek">
                <ListItemText primary="Kalendarz" />
              </ListItem>
            </Drawer>
          </div>

        </div>
      )
    }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Home)
