import React, { Component } from 'react';
import { number, string, oneOf } from 'prop-types';

class Marker extends Component {
  static propTypes = { 
    lat: oneOf( [string, number] ),
    lng: oneOf( [string, number] ),
  }

  render() {
    const {  lat, lng } = this.props;
 
    return (
      <i
        style={{ transform: 'translate(-50%, -50%)'  }}
        className="fas fa-map-marker"
        lat={lat}
        lng={lng}
      />
    );
  }
}

export default Marker;
