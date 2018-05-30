import React, { Component } from 'react';
import { number, string, func, oneOfType } from 'prop-types';
import Html from 'react-native-render-html';
import { Input } from '../../../components';

class InputRead extends Component {
  static defaultProps = {
    maxHeight: 500, // TODO: Make an option to fill the rest of the screen
  }

  static propTypes = {
    height: oneOfType(
      [number, string]
    ),
    minHeight: oneOfType(
      [number, string]
    ),
    maxHeight: oneOfType(
      [number, string]
    ),
    onChangeValue: func,
    html: string,
  }

  handleScrollEnd = () => {
    if ( this.props.onChangeValue )
      this.props.onChangeValue( 'true' );
  }

  render() {
    const { height, maxHeight, minHeight, html } = this.props;

    return (
      <Input
        type="scroll"
        height={height}
        minHeight={minHeight}
        maxHeight={maxHeight}
        onScrollEnd={this.handleScrollEnd}
      >
        <Html
          html={html}
        />
      </Input>
    );
  }
}

export default InputRead;
