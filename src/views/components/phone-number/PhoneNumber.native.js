import React, { Component } from 'react';
import { string, bool, oneOf, node } from 'prop-types';
import { Linking, Platform } from 'react-native';
import { formatPhoneNumber } from '../../../utils';
import { Text, Touchable } from '../index';

class PhoneNumber extends Component {
  static defaultProps = {
    type: 'tel',
    testID: 'input-phone-number',
  }

  static propTypes = {
    mobile: bool,
    landline: bool,
    children: node,
    number: string,
    type: oneOf(
      ['tel', 'sms']
    ),
    testID: string,
  }

  handlePress = ( number, type ) => () => {
    // sms doesnt crash app
    // tel crashes app

    const url = `${type}:${Platform.OS === 'android' ? '//' : ''}${number}`;

    Linking.canOpenURL( url )
      .then( supported => {
        if ( !supported ) {
          // eslint-disable-next-line no-console
          console.log( `Can't handle url: ${url}`  );
        } else {
          // eslint-disable-next-line no-console
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
      testID,
      ...restProps
    } = this.props;

    const checkedNumber =  formatPhoneNumber( number, { mobile, landline });

    return (
      <Touchable
        onPress={this.handlePress( checkedNumber, type )}
        withFeedback
        testID={testID}
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
