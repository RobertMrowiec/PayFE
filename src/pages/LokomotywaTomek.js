import React from 'react';
import { Redirect } from 'react-router-dom';
import Iframe from 'react-iframe'

class Default extends React.Component {

  render() {
    return (
      <div style = {{marginLeft:'200px', marginTop:'-85px'}}>
        <Iframe url="https://lokomotywatomek.herokuapp.com/"
          width='98%'
          height='970px'
          id="myId"
          display="initial"
          position="relative"
          allowFullScreen
        />
      </div>
    )
  }
}

export default Default;