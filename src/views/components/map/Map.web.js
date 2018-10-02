import React, { Component } from 'react';
import {  node, number, oneOfType, string } from 'prop-types';
import GoogleMapReact from 'google-map-react';

/* global google */
class MapView extends Component {
  static defaultProps = {
    height: 300,
    width: 600,
  };

  static propTypes = {
    height: oneOfType( [string, number] ),
    width: oneOfType( [string, number] ),
    children: node,
  };

  render() {
    const { height, width } = this.props;

    console.warn( ' Loggin Props', this.props );

    return (
      <div style={{ height: height, width: width }}>
        { google ?  (
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyC5HjeRqeoqbxHEQWieE0g9hLaN6snjorA' }}
            defaultCenter={{ lat: -25.8043538, lng: 138.2538214 }}
            defaultZoom={3}
          >
            {this.props.children}
          </GoogleMapReact>
        ) 
          : 'Google Object Not found please wait or refresh the application window'
        }
      </div>
    );
  }
}

export default MapView;
