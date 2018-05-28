import React, { cloneElement } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { withNavigation } from 'react-navigation';
import { any, bool, func, string, object } from 'prop-types';
import { navigator } from '../../../utils';

const Link = ({
  children = 'Link',
  to,
  disabled,
  onPress,
  decoration = 'none',
  useAuthNavigator = false,
  ...restProps
}) => {
  const handlePress = event => {
    if ( disabled ) return;

    console.warn( 'pressed', to );

    navigator.navigate({
      routeName: to,
      useAuthNavigator,
    });

    if ( onPress )
      onPress( event );
  };

  if ( typeof children === 'function' ) {
    return children({
      onPress: handlePress,
    });
  }

  return (
    <TouchableWithoutFeedback
      {...restProps}
      onPress={handlePress}
      disabled={disabled}
      style={{
        textDecorationLine: decoration,
      }}
    >
      {cloneElement( children, {
        onPress: handlePress,
      })}
    </TouchableWithoutFeedback>
  );
};

Link.propTypes = {
  children: any,
  to: string.isRequired,
  disabled: bool,
  onPress: func,
  navigation: object,
  decoration: string,
  useAuthNavigator: bool,
};

export default withNavigation( Link );
