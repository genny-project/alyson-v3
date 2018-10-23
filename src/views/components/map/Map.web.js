import React, { Component } from 'react';
import {  node, number, oneOfType, string } from 'prop-types';
import GoogleMapReact from 'google-map-react';
import config from '../../../config/config.web';

/* global google, window */

class MapView extends Component {
  static defaultProps = {
    height: 300,
    width: window.innerWidth,
  };

  static propTypes = {
    height: oneOfType( [string, number] ),
    width: oneOfType( [string, number] ),
    children: node,
    zoom: number,
  };

  static defaultProps = {
    zoom: 3,
  }

  render() {
    const { height, width , zoom } = this.props;

    console.log( 'MARKERS CHILDREN', this.props.children.length );

    return (
      <div>
        <div
          style={{ 
            position: 'relative',
            top: '80px',
            left: '10px',
            backgroundColor: 'whitesmoke',
            zIndex: 100, 
            width: '200px',
            padding: '8px',
          }}
        >
          <h2>
            Markers available:
            <span style={{ color: 'blue' }}> 
              {this.props.children && this.props.children.length - 1}
            </span>
          </h2>
        </div>

        <div style={{ height: height, width: width }}>
          { google ?  (
            <GoogleMapReact
              bootstrapURLKeys={{ key: config.GOOGLE_MAPS_APIKEY }}
              defaultCenter={{ lat: -25.8043538, lng: 138.2538214 }}
              defaultZoom={zoom}
            >
              {this.props.children}
            </GoogleMapReact>
          )
            : 'Google Object Not found please wait or refresh the application window'
        }
        </div>
      </div>
    );
  }
}

export default MapView;
