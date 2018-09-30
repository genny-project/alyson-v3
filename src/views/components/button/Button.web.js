import React, { Component } from 'react';
import Button from './Button.js';

class ButtonWeb extends Component {
  handleBack = () => {
    window.history.go( -1 );
  }

  render() {
    return (
      <Button
        {...this.props}
        onBack={this.handleBack}
      />
    );
  }
}

export default ButtonWeb;
