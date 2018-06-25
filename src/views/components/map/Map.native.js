import React, { Component, Fragment } from 'react';
import { Dimensions } from 'react-native';
import { MapView } from 'expo';
import { array, bool } from 'prop-types';
import MapViewDirections from 'react-native-maps-directions';
import config from '../../../config';
import { Box } from '../';

class Map extends Component {
  static propTypes = {
    markers: array,
    showDirections: bool,
  }

  mapStyle = {
    height: '100%',
    width: '100%',
    flex: 1,
  }

  handleReady = result => {
    const { width, height } = Dimensions.get( 'window' );

    this.mapView.fitToCoordinates( result.coordinates, {
      edgePadding: {
        right: ( width / 30 ),
        bottom: ( height / 30 ),
        left: ( width / 30 ),
        top: ( height / 30 ),
      },
    });
  }

  render() {
    const { markers, showDirections } = this.props;

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
          {(
            markers &&
            markers instanceof Array &&
            markers.length > 0
          ) ? (
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
