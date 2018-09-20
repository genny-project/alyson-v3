import React, { Component, Children } from 'react';
import { array, string } from 'prop-types';

class Join extends Component {
    static defaultProps = {
      delimiter: ', ',
      items: [],
    }

    static propTypes = {
      delimiter: string,
      items: array,
    }

    render() {
      console.warn({
        ABABABABA: this.props,
      });
      const { items, delimiter } = this.props;

      return (
        items.join( delimiter )
      );
    }
}

export default Join;
