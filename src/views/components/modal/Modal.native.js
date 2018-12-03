import React, { Component } from 'react';
import  { bool, func, string } from 'prop-types';
import { Modal } from 'react-native';

class NativeModalWrapper extends Component {
  static defaultProps = {
    testID: 'native-modal-wrapper',
  }

  static propTypes = {
    visible: bool,
    onDismiss: func,
    testID: string,
  }

  componentDidUpdate( prevProps ) {
    if ( this.props.visible !== prevProps.visible ) {
      if ( !this.props.visible ) {
        if ( this.props.onDismiss ) {
          this.props.onDismiss();
        }
      }
    }
  }

  render() {
    const { visible, testID, ...restProps } = this.props;

    return (
      <Modal
        {...restProps}
        visible={visible}
        testID={testID}
      />
    );
  }
}

export default NativeModalWrapper;
