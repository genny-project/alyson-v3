import React, { Component, Fragment } from 'react';
import { MapView } from 'expo';
import { number, arrayOf, shape, bool } from 'prop-types';
import MapViewDirections from 'react-native-maps-directions';
import config from '../../../config';
import { isArray, isObject } from '../../../utils';
import { Box } from '../';

class Map extends Component {
  static propTypes = {
    markers: arrayOf(
      shape({
        latitude: number,
        longitude: number,
      })
    ),
    showDirections: bool,
  }

  static getDerivedStateFromProps( props, state ) {
    /* Ensure the new markers are a valid array. */
    if ( isArray( props.markers, { ofMinLength: 1 })) {
      /* If the lengths are different, update the state with the new markers. */
      if ( !isArray( state.markers, { ofExactLength: props.markers.length })) {
        return { markers: props.markers };
      }

      /* Loop through the markers and check if the lat/long
       * of any have changed between props and state. */
      for ( let i = 0; i < props.markers.length; i++ ) {
        const propsMarker = props.markers[i];
        const stateMarker = state.markers[i];

        /* If the marker in props is NOT a valid marker object,
         * cancel this whole operation and don't update the state. */
        if ( !isObject( propsMarker, { withProperties: ['latitude', 'longitude'] }))
          return null;

        if (
          propsMarker.latitude !== stateMarker.latitude ||
          propsMarker.longitude !== stateMarker.longitude
        ) {
          return { markers: props.markers };
        }
      }
    }

    return null;
  }

  mapStyle = {
    height: '100%',
    width: '100%',
    flex: 1,
  }

  state = {
    markers: this.props.markers,
  }

  handleReady = result => {
    this.mapView.fitToCoordinates( result.coordinates, {
      edgePadding: {
        right: 40,
        bottom: 40,
        left: 40,
        top: 40,
      },
    });
  }

  render() {
    const { showDirections } = this.props;
    const { markers } = this.state;

    return (
      <Box
        flexDirection="column"
        width="100%"
        height="100%"
        flex={1}
      >
        <MapView
          ref={mapView => this.mapView = mapView}
          style={this.mapStyle}
        >
          {isArray( markers, { ofMinLength: 1 }) ? (
            <Fragment>
              {markers.map( marker => (
                <MapView.Marker
                  key={marker.key}
                  coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude,
                  }}
                />
              ))}

              {(
                showDirections &&
                markers.length === 2
              ) ? (
                <MapViewDirections
                  origin={markers[0]}
                  destination={markers[1]}
                  apikey={config.google.apiKey}
                  strokeColor="blue"
                  strokeWidth={2}
                  onReady={this.handleReady}
                  onError={errorMessage => {
                    console.warn( 'MapViewDirections error occurred:', errorMessage );
                  }}
                />
                ) : null}
            </Fragment>
          ) : null}
        </MapView>
      </Box>
    );
  }
}

export default Map;
