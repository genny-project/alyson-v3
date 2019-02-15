import React, { Component } from 'react';
import { Dimensions } from 'react-native-web';
import { string, node } from 'prop-types';
import Tooltip from '../Tooltip';
import Storage from '../../../../utils/storage';

class TestIdTooltip extends Component {
  static defaultProps = {
    id: 'test-id',
  };

  static propTypes = {
    id: string,
    children: node,
  };

  // persist the showcodes on localstorgae
  async persistCodes() {
    const { children } = this.props;
    let isDebugMode;

    if ( typeof window === 'object' ) {
      isDebugMode = window.originalQueryParams.showcodes;
    }

    const code = await Storage.get( 'showcodes' );

    if ( code === true || code === 'true' ) {
      isDebugMode = true;
    } else {
      isDebugMode = false;
    }

    if ( !isDebugMode ) {
      return children;
    }
  }

  handleMouseOver = () => {
    // eslint-disable-next-line no-console
    console.warn( 'TestId:', this.props.id );
  };

  render() {
    const { id, children } = this.props;

    const dimensions = Dimensions.get( 'window' );

    this.persistCodes();

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
