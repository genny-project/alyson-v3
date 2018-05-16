import React, { Component } from 'react';
import { Platform } from 'react-native';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import { location } from '../../../utils';
import { LayoutLoader, Redirect, KeycloakConsumer } from '../../components';
/* eslint-disable */

const layouts = {
  home: {
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
              size: 'sm'
            },
            children: [
              {
                component: 'Form',
                props: {
                },
              }
            ]
          },
        ],
      },
    ],
  },
  profile: {
    layout: {
      title: 'Profile',
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
            component: 'Text',
            children: 'Profile',
          },
        ],
      },
    ],
  },
  commons: {
    layout: {
      title: 'commons',
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
            component: 'Input',
            props: {
              type: 'switch',
              color: 'red',
            },
          },
        ],
      },
    ],
  },
  settings: {
    layout: {
      title: 'Settings',
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
            component: 'Text',
            children: 'Settings',
          },
        ],
      },
    ],
  },
  chat: {
    layout: {
      title: 'Chat',
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
            component: 'Text',
            children: 'Chat',
          },
        ],
      },
    ],
  },
  alerts: {
    layout: {
      title: 'Alerts',
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
            component: 'Text',
            children: 'Alerts',
          },
        ],
      },
    ],
  },
};

class Generic extends Component {
  static propTypes = {
    navigation: object,
    baseEntities: object,
  }

  render() {
    if ( !this.props.keycloak.isAuthenticated )
      return <Redirect to="auth" />;

    const currentUrl = Platform.OS === 'web'
      ? location.getBasePath()
      : this.props.navigation.state.params.layout;

    // const { attributes, data } = this.props.baseEntities;

    // console.log({ currentUrl });

    // const layoutAttribute = Object.keys( attributes ).find( attribute => {
    //   if ( attribute.startsWith( 'LAY' )) {
    //     console.log({ attribute });
    //     const layoutUrl = attributes[attribute].PRI_LAYOUT_URI.valueString.replace( /\//g, '' );

    //     if ( layoutUrl === currentUrl ) {
    //       return true;
    //     }
    //   }

    //   return false;
    // });

    // console.log({ layoutAttribute });

    // const layout = (
    //   attributes[layoutAttribute] != null &&
    //   attributes[layoutAttribute].PRI_LAYOUT_DATA &&
    //   attributes[layoutAttribute].PRI_LAYOUT_DATA.valueString
    // );

    // console.log({ layout });

    // let parsed = null;

    // try {
    //   parsed = JSON.parse( layout );
    // }
    // catch ( error ) {
    //   console.warn( 'Unable to parse layout', layout );
    // }

    // console.log({ parsed });

    return (
      <LayoutLoader
        //layout={parsed}
        layout={layouts[layout]}
      />
    );
  }
}

export { Generic };

const mapStateToProps = state => ({
  baseEntities: state.vertx.baseEntities,
});

export default connect( mapStateToProps )(
  props => (
    <KeycloakConsumer>
      {keycloak => <Generic {...props} keycloak={keycloak} />}
    </KeycloakConsumer>
  )
);
