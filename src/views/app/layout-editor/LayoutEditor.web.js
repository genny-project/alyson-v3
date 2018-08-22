import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { ConnectedRouter } from 'react-router-redux';
import { Text, Box, LayoutLoader } from '../../components';
import history from '../../../redux/history';

class LayoutEditor extends Component {
  state = {
    code: '',
    validCode: '',
  };

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
    const { code } = this.state;

    return (
      <Box height="100vh">
        <Box flexGrow={1}>
          <ConnectedRouter history={history}>
            <LayoutLoader layout={this.getJSONCode()} />
          </ConnectedRouter>
        </Box>
        <Box>
          <Text>
            <MonacoEditor
              width="800"
              height="100%"
              language="json"
              theme="vs-dark"
              value={code}
              onChange={this.handleChange}
              options={{
                automaticLayout: true,
              }}
            />
          </Text>
        </Box>
      </Box>
    );
  }
}

export default LayoutEditor;
