import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

import {  array, number, oneOfType, string, object } from 'prop-types';

/* global google */
class MapView extends Component {
  static defaultProps = {
    height: 300,
    width: '100%',
    markerIcon: null,
    markers: [],
  };

  static propTypes = {
    height: oneOfType( [string, number] ),
    width: oneOfType( [string, number] ),
    markerIcon: string,
    markers: array,
    google: object,
  };

  constructor( props ) {
    super( props );
    this.state = {
      selectedPlace: {
        lat: 40.854885,
        lng: -88.081807,
      },
    };
  }

  handleMarkerClick = ( props ) => {
    this.setState({
      selectedPlace: props,
      showingInfoWindow: true,
    });
  };

  /* render markers based on the location provided */
  renderMultipleMarkers = () => {
    const { markers,markerIcon } = this.props;

    if ( markers.length < 1 ) return null;
    const displayMarkers = () => {
      return markers.map( marker => (
        <Marker
          key={marker.id}
          title={marker.title}
          name={marker.name}
          onClick={this.handleMarkerClick}
          position={marker.position}
          icon={{
            url: markerIcon,
            anchor: new google.maps.Point( 32,32 ),
            scaledSize: new google.maps.Size( 64,64 ),
          }}
        />
      ));
    };

    return displayMarkers;
  };

  render() {
    const { height, width } = this.props;

    return (
      <Map
        google={this.props.google}
        zoom={13}
        style={{ height: height, width: width }}
      >
        {this.renderMultipleMarkers()}

        <InfoWindow
          marker={this.state.selectedPlace}
          visible={this.state.showingInfoWindow}
        >
          <div>
            <h1>
              {' '}
              Info window example
              {' '}
            </h1>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyC5HjeRqeoqbxHEQWieE0g9hLaN6snjorA',
})( MapView );
