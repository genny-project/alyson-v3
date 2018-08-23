import React, { Component } from 'react';
import Html from 'react-native-render-html';
import { string } from 'prop-types';
import { Box } from '../../components';

class DisplayHTML extends Component {
  static defaultProps = {
    content: '',
  }

  static propTypes = { 
    content: string,
  };

  render() { 
    const { content } = this.props;

    return (
      <Box>
        <Html
          html={content}
        />
      </Box>
    );
  }
}

export default DisplayHTML;
