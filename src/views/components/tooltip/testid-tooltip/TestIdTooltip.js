import React, { Component } from 'react';
import { Dimensions } from 'react-native-web';
import { string, node } from 'prop-types';
import Tooltip from '../Tooltip';

class TestIdTooltip extends Component {
  static defaultProps = {
    id: 'test-id',
  }

  static propTypes = {
    id: string,
    children: node,
  }

  handleMouseOver = () => {
    // eslint-disable-next-line no-console
    console.warn( 'TestId:', this.props.id );
  }

  render() {
    const { id, children } = this.props;

    const dimensions = Dimensions.get( 'window' );

    const isDebugMode = true;

    // console.log( 'isDebugMode?', isDebugMode );

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
