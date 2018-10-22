import React, { Component } from 'react';
import { node, bool } from 'prop-types';
import { Box } from '../../../index';

class InputTagBody extends Component {
  static propTypes = {
    children: node,
    isOpen: bool,
  }

  render() {
    const { children, isOpen } = this.props;

    if ( !isOpen ) return null;

    return (
      <Box
        flexDirection="column"
        position="absolute"
        backgroundColor="white"
        top={50}
        left={0}
        width="100%"
        zIndex={100}
        borderWidth={2}
        borderStyle="solid"
        borderColor="#DDD"
        cleanStyleObject
        maxHeight="11rem"
        overflow="auto"
      >
        {children}
      </Box>
    );
  }
}

export default InputTagBody;
