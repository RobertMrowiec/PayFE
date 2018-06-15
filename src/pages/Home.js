import React, {Component} from 'react';
import TextField from 'material-ui/TextField'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class Home extends Component {
  constructor(props) {
      super(props);
      this.state = {
          isDrawerOpen: false,
          username:'',
          password:''
      }
  }
  render(){
    return (
      <div style = {{marginLeft:'11%'}}>
        <h1>Jakies statystyki tu będą</h1>
      </div>
      
    )
  }
}

export default Home;
