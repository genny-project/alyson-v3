import React, { Component } from 'react';
import { Modal } from 'react-native';
import { Text } from '../../components';

class NativeModalWrapper extends Component {
  static defaultProps = {
  }

  static propTypes = {
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
    return (
      <Modal
        {...this.props}
        visible={this.props.visible}
      />
    );
  }
}

export default NativeModalWrapper;
