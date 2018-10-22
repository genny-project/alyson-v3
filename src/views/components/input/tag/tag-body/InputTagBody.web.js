import React, { Component } from 'react';
import { node, object, bool, func } from 'prop-types';
import { Box } from '../../../index';

class InputTagBody extends Component {
  static propTypes = {
    children: node,
    bodyProps: object,
    isOpen: bool,
    handleToggleMenu: func,
  }

  render() {
    const { children, bodyProps, isOpen, handleToggleMenu } = this.props;

    return (
      <Box
        {...bodyProps}
      >
        <Box
          position="relative"
          flexDirection="column"
        >
          {children}
          {
            isOpen ? (
              <Box
                zIndex={5}
                position="fixed"
                top={0}
                left={0}
                width="100%"
                height="100%"
                onClick={handleToggleMenu}
              />
            ) : null }
        </Box>
      </Box>
    );
  }
}

export default InputTagBody;
