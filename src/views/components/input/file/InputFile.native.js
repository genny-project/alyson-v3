import React, { Component } from 'react';
import { Box, Text } from '../../../components';

class InputFile extends Component {
  static defaultProps = {
  }

  static propTypes = {
  }

  render() {
    // const { } = this.props;
    return (
      <Box>
        <Text>
          Native file uploader
        </Text>
      </Box>
    );
  }
}

export default InputFile;
