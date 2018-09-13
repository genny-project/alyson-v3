import React, { Component } from 'react';
import { GoogleProvider } from '../google';

class Map extends Component {
  constructor( props ) {
    super( props );
    this.myRef = React.createRef();
  }

  render() {
    return (
      <div> 
        <GoogleProvider
          scriptTagId="google-map-web"
        >
          <div
            style={{ height: 200, width: 200 }}
            className="google-map-web"
            id="google-map-web"
            ref={this.myRef}
          />
        </GoogleProvider>
      </div>
      
    );
  }
}

export default Map;
