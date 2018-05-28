import React, { cloneElement } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { withNavigation } from 'react-navigation';
import { any, bool, func, string, object } from 'prop-types';
import { routes } from '../../../config';
import { navigator } from '../../../utils';

const Link = ({
  children = 'Link',
  to,
  disabled,
  onPress,
  navigation,
  decoration = 'none',
  useAppNavigator = true,
  ...restProps
}) => {
  const handlePress = event => {
    if ( disabled ) return;

    if ( useAppNavigator ) {
      navigator.navigate({ routeName: to });
    }
    else if ( routes[to] )
      navigation.navigate( to );
    else {
      navigation.navigate({
        routeName: 'generic',
        params: { layout: to },
        key: to,
      });
    }

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
  useAppNavigator: bool,
};

export default withNavigation( Link );
