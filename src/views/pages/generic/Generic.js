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
            component: 'BucketView',
            repeat: '_query',
            children: {
              component: 'BucketList',
              repeat: '_repeater.items',
              props: {
                headerText: '{{repeater.name}}',
              },
              children: {
                component: 'BucketCard',
                props: {
                  status: '{{repeater.item.attributes.STA_STATUS.valueString}}',
                  image: 'https://images.channel40.com.au/24x/{{repeater.links.LOAD.attributes.PRI_IMAGE_URL.valueString}}',
                },
                children: [
                  {
                    component: 'Label',
                    props: {
                      text: '{{repeater.item.name}}',
                    },
                  },
                  {
                    component: 'Label',
                    props: {
                      size: 'xxs',
                      text: '{{repeater.item.attributes.PRI_PICKUP_ADDRESS_SUBURB.valueString}}, {{repeater.item.attributes.PRI_PICKUP_ADDRESS_STATE.valueString}} - {{repeater.item.attributes.PRI_DROPOFF_ADDRESS_SUBURB.valueString}}, {{repeater.item.attributes.PRI_DROPOFF_ADDRESS_STATE.valueString}}',
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    ],
    query: [
      {
        operator: 'getBE',
        id: 'GRP_DASHBOARD',
        as: 'dashboard',
      },
      {
        operator: 'scope',
        path: 'dashboard.links',
        scope: {
          operator: 'getBE',
          basePath: 'baseEntities.data',
          as: 'be',
          id: '{{link.targetCode}}',
        },
      },
      {
        operator: 'map',
        fields: 'dashboard.links',
      },
      {
        operator: 'sort',
        by: 'weight',
        direction: 'asc',
      },
      {
        operator: 'map',
        fields: 'be',
      },
      {
        operator: 'scope',
        path: 'links',
        scope: {
          operator: 'getBE',
          basePath: 'baseEntities.data',
          as: 'be',
          id: '{{link.targetCode}}',
        },
      },
      {
        operator: 'map',
        fields: {
          name: 'name',
          items: 'links',
        },
      },
      {
        operator: 'scope',
        path: 'items',
        scope: {
          operator: 'find',
          query: {
            be: { $exists: true },
          },
        },
      },
      {
        operator: 'scope',
        path: 'items',
        scope: {
          operator: 'map',
          fields: {
            linkValue: 'link.linkValue',
            item: 'be',
          },
        },
      },
      {
        operator: 'scope',
        path: 'items',
        scope: {
          operator: 'populateLinkValues',
          field: 'item',
          as: 'links',
        },
      },
      {
        operator: 'scope',
        path: 'items',
        scope: {
          operator: 'populateAttributes',
          path: 'links',
        },
      },
      {
        operator: 'scope',
        path: 'items',
        scope: {
          operator: 'populateAttributes',
          path: 'item',
          single: true,
        },
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
          {
            component: 'Input',
            props: {
              type: 'dropdown',
            },
          },
          {
            component: 'Input',
            props: {
              type: 'dropdown',
              items: [
                'One',
                'Two',
              ],
            },
          },
          {
            component: 'Input',
            props: {
              type: 'dropdown',
              items: [
                {
                  label: 'One',
                  value: 'one',
                },
                {
                  label: 'Two',
                  value: 'two',
                },
              ],
            },
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
    const layout = Platform.OS === 'web'
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
