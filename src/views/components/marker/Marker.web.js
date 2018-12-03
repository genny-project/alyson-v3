import React, { Component } from 'react';
import { number, string, oneOfType } from 'prop-types';

class Marker extends Component {
  static defaultProps = {
    markerColor: 'red',
    markerSize: 30,
  }

  static propTypes = {
    lat: oneOfType( [string, number] ),
    lng: oneOfType( [string, number] ),
    markerColor: string,
    markerSize: number,
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
