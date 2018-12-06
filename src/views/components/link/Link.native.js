import React, { Component, cloneElement, createElement } from 'react';
import { withNavigation, NavigationActions } from 'react-navigation';
import { Linking } from 'react-native';
import { any, bool, func, string, object } from 'prop-types';
import { routes } from '../../../config';
import { store } from '../../../redux';
import { Touchable } from '../index';
import { withKeycloak } from '../keycloak';

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
    keycloak: object,
    externalLink: bool,
  }

  handlePress = event => {
    const {
      disabled,
      useAppNavigator,
      to,
      navigation,
      onPress,
      params,
      keycloak,
      externalLink,
    } = this.props;

    if ( disabled )
      return;

    if ( externalLink ) {
      const url = `http://${to}`;

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
    else if (
      keycloak.isAuthenticated &&
      useAppNavigator
    ) {
      store.dispatch(
        NavigationActions.navigate({
          routeName: routes[to] ? to : 'generic',
          params: {
            ...params,
            layout: to,
          },
        }),
      );
    }
    else {
      navigation.navigate({
        routeName: routes[to]
          ? to
          : keycloak.isAuthenticated
            ? 'generic'
            : 'public',
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
        child.type.name.includes( 'Button' ) ||
        child.type.name.includes( 'Touchable' )
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

export default withNavigation( withKeycloak( Link ));
