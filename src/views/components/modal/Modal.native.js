import React, { Component } from 'react';
import  { bool, func } from 'prop-types';
import { Modal } from 'react-native';

class NativeModalWrapper extends Component {
  static defaultProps = {
  }

  static propTypes = {
    visible: bool,
    onDismiss: func,
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
