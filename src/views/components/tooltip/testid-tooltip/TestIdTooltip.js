import React, { Component } from 'react';
import { Dimensions } from 'react-native-web';
import { string, node } from 'prop-types';
import Tooltip from '../Tooltip';

class TestIdTooltip extends Component {
  static defaultProps = {
    id: 'test-id',
  };

  static propTypes = {
    id: string,
    children: node,
  };

  handleMouseOver = () => {
    // eslint-disable-next-line no-console
    console.warn( 'TestId:', this.props.id );
  };

  render() {
    const { id, children } = this.props;

    const dimensions = Dimensions.get( 'window' );

    let isDebugMode = window.originalQueryParams.showcodes;

    if (
      localStorage.getItem( 'showcodes' ) === true ||
      localStorage.getItem( 'showcodes' ) === 'true'
    ) {
      console.log(localStorage.getItem('showcodes')); // eslint-disable-line
      isDebugMode = true || window.originalQueryParams.showcodes;
    }
    console.warn({ isDebugMode }); // eslint-disable-line
    if ( !isDebugMode ) {
      return children;
    }

    return (
      <Tooltip
        position="fixed"
        top={10}
        left={dimensions.width / 2}
        zIndex={1000}
        text={id}
        onMouseOver={this.handleMouseOver}
      >
        {children}
      </Tooltip>
    );
  }
}

export default TestIdTooltip;
