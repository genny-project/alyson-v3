import React, { Component } from 'react';
import { MapView } from 'expo';
import { array } from 'prop-types';
import { Box } from '../';

class Map extends Component {
  static propTypes = {
    markers: array,
  }

  render() {
    const { markers } = this.props;

    const markerComponents = markers && markers.map(( marker, index ) => (
      <MapView.Marker
        key={index} // eslint-disable-line
        coordinate={{
          latitude: marker.latitude,
          longitude: marker.longitude,
        }}
      />
    ));

    return (
      <Box
        flexDirection="column"
        width="100%"
        height="100%"
        flex={1}
      >
        <MapView
          style={{
            height: '100%',
            width: '100%',
            flex: 1,
          }}
        >
          {markerComponents}

          <MapView.Marker
            key={0}
            coordinate={{
              latitude: -37.8136,
              longitude: 144.9631,
            }}
          />

          <MapView.Marker
            key={0}
            coordinate={{
              latitude: -33.8688,
              longitude: 151.2093,
            }}
          />
        </MapView>
      </Box>

    );
  }
}

export default Map;
