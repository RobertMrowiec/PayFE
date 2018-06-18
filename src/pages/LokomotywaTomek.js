import React from 'react';
import { Redirect } from 'react-router-dom';
import Iframe from 'react-iframe'

class Default extends React.Component {

  render() {
    return (
      <div style = {{paddingLeft: '143px', marginTop: '-6.2%'}}>
        <Iframe url="http://hosting.surprise.design/"
          width='100%'
          height='889px'
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