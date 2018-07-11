import React, { Component } from 'react';
import { func, oneOfType, string, number } from 'prop-types';
import { Box, Text } from '../../';

class InputCreditCard extends Component {
  static propTypes = {
    onChangeValue: func,
    margin: oneOfType(
      [number, string]
    ),
    marginX: oneOfType(
      [number, string]
    ),
    marginY: oneOfType(
      [number, string]
    ),
    marginTop: oneOfType(
      [number, string]
    ),
    marginRight: oneOfType(
      [number, string]
    ),
    marginBottom: oneOfType(
      [number, string]
    ),
    marginLeft: oneOfType(
      [number, string]
    ),
  }

  handleChange = form => {
    if ( this.props.onChangeValue )
      this.props.onChangeValue( form );
  }

  render() {
    const {
      margin,
      marginX,
      marginY,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
    } = this.props;

    return (
      <Box
        margin={margin}
        marginX={marginX}
        marginY={marginY}
        marginTop={marginTop}
        marginRight={marginRight}
        marginBottom={marginBottom}
        marginLeft={marginLeft}
      >
        <Text>
          TODO Credit Card Input
        </Text>
      </Box>
    );
  }
}

export default InputCreditCard;
