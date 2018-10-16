import React, { Component } from 'react';
import { func, oneOfType, string, number, bool, object } from 'prop-types';
import { CreditCardInput } from 'react-native-credit-card-input';
import { Box } from '../../';

class InputCreditCard extends Component {
  static defaultProps = {
    requiresName: true,
  }

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
    requiresName: bool,
    additionalInputsProps: object,
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
      requiresName,
      additionalInputsProps,
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
        testID="input-credit-card"
      >
        <CreditCardInput
          onChange={this.handleChange}
          requiresName={requiresName}
          additionalInputsProps={additionalInputsProps}
        />
      </Box>
    );
  }
}

export default InputCreditCard;
