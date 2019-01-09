import React, { Component } from 'react';
import {  node, number, oneOfType, string, object } from 'prop-types';
import GoogleMapReact from 'google-map-react';
import { connect } from 'react-redux';
import { getDeviceSize } from '../../../utils';

/* global google, window */

class MapView extends Component {
  static defaultProps = {
    height: 300,
    width: window.innerWidth,
    zoom: 3,
  };

  static propTypes = {
    height: oneOfType( [string, number] ),
    width: oneOfType( [string, number] ),
    children: node,
    zoom: number,
    config: object,
  };

  render() {
    const { height, width, zoom, config } = this.props;

    return (
      <div
        style={{
          ...getDeviceSize() === 'sm' ? { width: '100%' } : {},
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            ...getDeviceSize() === 'sm'
              ? { backgroundColor: 'white' }
              : {  backgroundColor: 'whitesmoke' },
            zIndex: 100,
            ...getDeviceSize() === 'sm' ? {} : {  width: '200px' },
            padding: '8px',
          }}
        >
          <h2
            style={{
              ...getDeviceSize() === 'sm'
                ? {
                  fontSize: '12px',
                }
                : {},
            }}
          >
            Markers available:
            <span style={{ color: 'blue' }}>
              {this.props.children && this.props.children.length - 1}
            </span>
          </h2>
        </div>

        <div style={{ height: height, width: width }}>
          { google ?  (
            <GoogleMapReact
              bootstrapURLKeys={{ key: config && config.ENV_GOOGLE_MAPS_APIKEY }}
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

const mapStateToProps = state => ({
  config: state.keycloak.data,
});

export default connect( mapStateToProps )( MapView );
