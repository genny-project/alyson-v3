import React, { Component, Fragment } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { number, arrayOf, oneOfType, shape, bool, string, object } from 'prop-types';
import MapViewDirections from 'react-native-maps-directions';
import { connect } from 'react-redux';
import { isArray, isObject } from '../../../utils';
import { Box } from '../';

class Map extends Component {
  static defaultProps = {
    testID: 'map',
  }

  static propTypes = {
    markers: arrayOf(
      shape({
        latitude: oneOfType( [number, string] ),
        longitude: oneOfType( [number, string] ),
      })
    ),
    showDirections: bool,
    testID: string,
    config: object,
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
    const { showDirections, testID, config } = this.props;
    const { markers } = this.state;

    return (
      <Box
        flexDirection="column"
        width="100%"
        height="100%"
        flex={1}
        testID={testID}
      >
        <MapView
          ref={mapView => this.mapView = mapView}
          style={this.mapStyle}
        >
          {isArray( markers, { ofMinLength: 1 }) ? (
            <Fragment>
              {markers.map( marker => (
                <Marker
                  key={marker.key}
                  coordinate={{
                    latitude: Number( marker.latitude ),
                    longitude: Number( marker.longitude ),
                  }}
                />
              ))}

              {(
                showDirections &&
                markers.length === 2
              ) ? (
                <MapViewDirections
                  origin={{
                    latitude: Number( markers[0].latitude ),
                    longitude: Number( markers[0].longitude ),
                    key: markers.key,
                  }}
                  destination={{
                    latitude: Number( markers[1].latitude ),
                    longitude: Number( markers[1].longitude ),
                    key: markers.key,
                  }}
                  apikey={config && config.ENV_GOOGLE_MAPS_APIKEY}
                  strokeColor="blue"
                  strokeWidth={2}
                  onReady={this.handleReady}
                  onError={errorMessage => {
                    // eslint-disable-next-line no-console
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

const mapStateToProps = state => ({
  config: state.keycloak.data,
});

export default connect( mapStateToProps )( Map );
