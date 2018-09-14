import React, { Component } from 'react';

class Map extends Component {
  constructor( props ) {
    super( props );
    this.myRef = React.createRef();
  }

  render() {
    return (
      <div>
        <h1>
        Maps component
        </h1>
      </div>
    );
  }
}

export default Map;
