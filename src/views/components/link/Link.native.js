import React, { createElement } from 'react';
import { withNavigation } from 'react-navigation';
import { any, bool, func, string, object } from 'prop-types';
import { routes } from '../../../config';
import { navigator } from '../../../utils';
import { Touchable } from '../../components';

const Link = ({
  children = 'Link',
  to,
  disabled,
  onPress,
  navigation,
  useAppNavigator = false,
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

  const touchableProps = {
    ...restProps,
    onPress: handlePress,
  };

  return React.Children.map( children, child => (
    createElement(
      Touchable,
      touchableProps,
      child
    )
  ));
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
