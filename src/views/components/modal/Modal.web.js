import React, { Component } from 'react';
import { any, string, node, func } from 'prop-types';
import ReactModal from 'react-modal';
import { TouchableOpacity } from 'react-native';
import { Box, Icon } from '../../components';

ReactModal.setAppElement( '#root' );

class Modal extends Component {  
  static defaultProps = {
    size: 'sm',
    testID: 'modal',
  }

  static propTypes = {
    children: any,
    size: string,
    header: node,
    footer: node,
    onPress: func,
    testID: string,
  }

  handlePress = () => {
    // onsole.log( 'press' );
    if ( this.props.onPress ) this.props.onPress();
  }

  handleClose = () => {
    // console.log( 'close' );
    if ( this.props.onPress ) this.props.onPress();
  }

  render() {
    const { 
      children,
      size,
      header,
      footer,
      testID,
    } = this.props;

    const containerWidth = {
      sm: 400,
      md: 600,
      lg: 800,
    };

    const style = {
      content: {
        width: containerWidth[size],
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        position: 'relative',
      },
    };

    return (
      <ReactModal
        isOpen={open}
        contentLabel="Modal"
        style={style}
        onRequestClose={this.handleClose}
        shouldCloseOnOverlayClick
        testID={testID}
      >
        <Box
          position="absolute"
          right={10}
          top={10}
        >
          <TouchableOpacity
            onPress={this.handlePress}
          >
            <Icon
              name="close"
              color="gray"
            />
          </TouchableOpacity>
        </Box>
        { header && (
          <Box>
            {header}
          </Box>
        )}
        {children}
        { footer && (
          <Box>
            {footer}
          </Box>
        )}
      </ReactModal>
    );
  }
}

export default Modal;
