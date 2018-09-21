import React from 'react';
import { array, string } from 'prop-types';

class Join extends React.Component {
    static defaultProps = {
      delimiter: ', ',
      items: [],
    }

    static propTypes = {
      delimiter: string,
      items: array,
    }

    render() {
      const { items, delimiter } = this.props;

      return (
        items.join( delimiter )
      );
    }
}

export default Join;
