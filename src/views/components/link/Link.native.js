import React, { Component, cloneElement, createElement } from 'react';
import { withNavigation } from 'react-navigation';
import { any, bool, func, string, object } from 'prop-types';
import { routes } from '../../../config';
import { navigator } from '../../../utils';
import { Touchable } from '../index';

class Link extends Component {
  static defaultProps = {
    useAppNavigator: true,
  }

  static propTypes = {
    children: any,
    to: string.isRequired,
    disabled: bool,
    onPress: func,
    navigation: object,
    decoration: string,
    useAppNavigator: bool,
    pure: bool,
    withoutFeedback: bool,
    params: object,
  }

  handlePress = event => {
    const { disabled, useAppNavigator, to, navigation, onPress, params } = this.props;

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
  }

  render() {
    const {
      children = 'Link',
      withoutFeedback,
      pure,
      ...restProps
    } = this.props;

    if ( typeof children === 'function' ) {
      return children({
        onPress: this.handlePress,
      });
    }

    const linkProps = {
      ...restProps,
      onPress: this.handlePress,
    };

    return React.Children.map( children, child => {
      if (
        pure ||
        child.type.name === 'Button'
      ) {
        return cloneElement(
          child,
          linkProps
        );
      }

      return createElement(
        Touchable,
        {
          ...linkProps,
          withFeedback: !withoutFeedback,
        },
        child
      );
    });
  }
}

export default withNavigation( Link );
