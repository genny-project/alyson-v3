import React, { Component } from 'react';
import { node, object } from 'prop-types';
import { Box } from '../../../index';

class InputTagBody extends Component {
  static propTypes = {
    children: node,
    bodyProps: object,
  }

  render() {
    const { children, bodyProps } = this.props;

    return (
      <Box
        {...bodyProps}
      >
        {children}
      </Box>
    );
  }
}

export default InputTagBody;
