import React, { Component } from 'react';
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
        <div
          dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
            __html: content,
          }}
        />
      </Box>
    );
  }
}

export default DisplayHTML;
