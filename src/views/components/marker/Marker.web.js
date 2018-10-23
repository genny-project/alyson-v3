import React, { Component } from 'react';
import { number, string, oneOf } from 'prop-types';

class Marker extends Component {
  static propTypes = {
    lat: oneOf( [string, number] ),
    lng: oneOf( [string, number] ),
    markerColor: string,
    markerSize: number,
  }

  static defaultProps = {
    markerColor: 'red',
    markerSize: 30,
  }

  render() {
    const {  lat, lng, markerColor ,markerSize } = this.props;

    return (
      <i
        style={{ transform: 'translate(-50%, -50%)', color: markerColor, fontSize: markerSize  }}
        className="fas fa-map-marker-alt"
        lat={lat}
        lng={lng}
      />
    );
  }
}

export default Marker;
