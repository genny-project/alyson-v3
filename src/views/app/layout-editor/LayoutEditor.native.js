import React, { Component } from 'react';
import SocketIO from 'socket.io-client';
import { Box, LayoutLoader } from '../../components';

class LayoutEditor extends Component {
  state = {
    code: '',
    validCode: '',
  };

  componentDidMount() {
    this.socket = SocketIO( 'http://localhost:6500' );
    this.socket.on( 'code', message => {
      this.handleChange( JSON.stringify( message ));
    });
  }

  getJSONCode() {
    try {
      return JSON.parse( this.state.code );
    } catch ( e ) {
      return this.state.validCode;
    }
  }

  handleChange = newValue => {
    this.setState({
      code: newValue,
    }, () => {
      this.setState({
        validCode: this.getJSONCode(),
      });
    });
  }

  render() {
    return (
      <Box height="100%">
        <Box flexGrow={1}>
          <LayoutLoader layout={this.getJSONCode()} />
        </Box>
      </Box>
    );
  }
}

export default LayoutEditor;
