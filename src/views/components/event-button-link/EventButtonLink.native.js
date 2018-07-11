
/**
 * Temporary component!
 *
 * I was in a rush so I needed to add this component and `EventButton`
 * to fix a few bugs in the application quickly.
 *
 * Please forgive me.
 */

import React from 'react';
import { withNavigation } from 'react-navigation';
import { string, bool, any, func, object } from 'prop-types';
import { routes } from '../../../config';
import { EventButton } from '../../components';

const EventButtonLink = ({
  disabled = false,
  onPress,
  children,
  useAppNavigator,
  to,
  navigation,
  params,
  ...restProps
}) => {
  const handlePress = event => {
    if ( disabled )
      return;

    if ( useAppNavigator ) {
      navigator.navigate({ routeName: to, params });
    }
    else if ( routes[to] )
      navigation.navigate( to, params );
    else {
      navigation.navigate({
        routeName: 'generic',
        params: {
          ...params,
          layout: to,
        },
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

  const addedProps = {
    ...restProps,
    onPress: handlePress,
  };

  return React.createElement(
    EventButton,
    addedProps,
    children
  );
};

EventButtonLink.propTypes = {
  children: any,
  buttonCode: string.isRequired,
  value: string.isRequired,
  onPress: func,
  disabled: bool,
  useAppNavigator: bool,
  navigation: object,
  params: object,
  to: string,
};

export default withNavigation( EventButtonLink );
