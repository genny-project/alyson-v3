import React, { Component } from 'react';
import { Platform } from 'react-native';
import { object } from 'prop-types';
import { location } from '../../../utils';
import { LayoutLoader, Redirect, KeycloakConsumer } from '../../components';
import LayoutFetcher from './LayoutFetcher';

class Generic extends Component {
  static propTypes = {
    navigation: object,
    keycloak: object,
  }

  render() {
    const currentUrl = Platform.OS === 'web'
      ? `/${location.getBasePath()}`
      : `/${this.props.navigation.state.params.layout}`;

    if ( !this.props.keycloak.isAuthenticated )
      return <Redirect to={`auth?redirectURL=${currentUrl}`} />;

    const home = {
      layout: {
        title: 'Home',
        appColor: 'dark',
      },
      children: [
        {
          component: 'Box',
          props: {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            height: '100%',
          },
          children: [
            {
              component: 'Container',
              props: {
                size: 'sm',
                flexDirection: 'column',
              },
              children: [
                {
                  component: 'Input',
                  props: {
                    type: 'image',
                  },
                },
                {
                  component: 'Input',
                  props: {
                    type: 'file',
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    return (
      <LayoutFetcher currentUrl={currentUrl}>
        { layout => (
          <LayoutLoader
            layout={layout}
          />
        )}
      </LayoutFetcher>
    );
  }
}

export { Generic };

export default props => (
  <KeycloakConsumer>
    {keycloak => <Generic {...props} keycloak={keycloak} />}
  </KeycloakConsumer>
);
