import React, { Component } from 'react';
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

class Genny extends Component {
  render() {
    const base = location.getBasePath();

    return (
      <LayoutLoader
        layout={layouts[base]}
      />
    );
  }
}

export default Genny;
