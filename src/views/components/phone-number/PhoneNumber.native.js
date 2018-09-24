import React, { Component } from 'react';
import { string, bool, oneOf, node } from 'prop-types';
import { Linking, Platform } from 'react-native';
import { formatPhoneNumber } from '../../../utils';
import { Text, Touchable } from '../index';

class PhoneNumber extends Component {
  static defaultProps = {
    type: 'tel',
  }

  static propTypes = {
    mobile: bool,
    landline: bool,
    children: node,
    number: string,
    type: oneOf(
      'tel', 'sms'
    ),
  }

  handlePress = ( number, type ) => () => {
    // sms doesnt crash app
    // tel crashes app

    const url = `${type}:${Platform.OS === 'android' ? '//' : ''}${number}`;

    Linking.canOpenURL( url )
      .then( supported => {
        if ( !supported ) {
          console.log( `Can't handle url: ${url}`  );
        } else {
          console.log( 'opening link' );

          return Linking.openURL( url );
        }
      }).catch( err => console.error( 'An error occurred', err ));
  }

  render() {
    const {
      children,
      mobile,
      landline,
      number,
      type,
      ...restProps
    } = this.props;

    const checkedNumber =  formatPhoneNumber( number, { mobile, landline });

    return (
      <Touchable
        onPress={this.handlePress( checkedNumber, type )}
        withFeedback
      >
        {
          children
            ? children
            : (
              <Text
                {...restProps}
                text={checkedNumber}
              />
            )
        }
      </Touchable>
    );
  }
}

export default PhoneNumber;
