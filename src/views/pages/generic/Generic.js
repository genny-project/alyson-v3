import React, { Component } from 'react';
import { Platform } from 'react-native';
import { object } from 'prop-types';
import { location } from '../../../utils';
import { LayoutLoader } from '../../components';

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
            component: 'Text',
            children: 'Home',
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
  }

  render() {
    const layout =
      Platform.OS === 'web'
        ? location.getBasePath()
        : this.props.navigation.state.params.layout;

    return (
      <LayoutLoader
        layout={layouts[layout]}
      />
    );
  }
}

export default Generic;
