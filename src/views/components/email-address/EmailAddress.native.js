import React, { Component } from 'react';
import { string } from 'prop-types';
import { Linking } from 'react-native';
import { Text, Touchable } from '../index';

class EmailAddress extends Component {
  static propTypes = {
    email: string,
    children: string,
  }

  handlePress = () => {
    const { email } = this.props;
    const url = `mailto:${email}`;

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
      email,
      ...restProps
    } = this.props;

    return (
      <Touchable
        onPress={this.handlePress}
      >
        <Text {...restProps}>
          { email ||  children }
        </Text>
      </Touchable>
    );
  }
}

export default EmailAddress;
