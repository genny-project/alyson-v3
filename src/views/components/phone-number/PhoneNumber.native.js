import React, { Component } from 'react';
import { string, bool } from 'prop-types';
import { Linking } from 'react-native';
import { formatPhoneNumber } from '../../../utils';
import { Text, Touchable } from '../index';

class PhoneNumber extends Component {
  static propTypes = {
    mobile: bool,
    landline: bool,
    children: string,
    number: string,
  }

  handlePress = () => {
    const { number } = this.props;
    const url = `tel:${number}`;

    Linking.canOpenURL( url )
      .then( supported => {
        if ( !supported ) {
          console.log( `Can't handle url: ${url}`  );
        } else {
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
      ...restProps
    } = this.props;

    return (
      <Touchable
        onPress={this.handlePress}
      >
        <Text {...restProps}>
          {formatPhoneNumber( number || children, {
            mobile,
            landline,
          })}
        </Text>
      </Touchable>
    );
  }
}

export default PhoneNumber;
