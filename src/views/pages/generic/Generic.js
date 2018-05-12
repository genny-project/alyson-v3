import React, { Component } from 'react';
import { Platform } from 'react-native';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import { location } from '../../../utils';
import { LayoutLoader } from '../../components';
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
    const currentUrl = Platform.OS === 'web'
      ? location.getBasePath()
      : this.props.navigation.state.params.layout;

    const { attributes, data } = this.props.baseEntities;

    console.log({ currentUrl });

    const layoutAttribute = Object.keys( attributes ).find( attribute => {
      if ( attribute.startsWith( 'LAY' )) {
        console.log({ attribute });
        const layoutUrl = attributes[attribute].PRI_LAYOUT_URI.valueString.replace( /\//g, '' );

        if ( layoutUrl === currentUrl ) {
          return true;
        }
      }

      return false;
    });

    console.log({ layoutAttribute });

    const layout = (
      attributes[layoutAttribute] != null &&
      attributes[layoutAttribute].PRI_LAYOUT_DATA &&
      attributes[layoutAttribute].PRI_LAYOUT_DATA.valueString
    );

    console.log({ layout });

    let parsed = null;

    try {
      parsed = JSON.parse( layout );
    }
    catch ( error ) {
      console.warn( 'Unable to parse layout', layout );
    }

    console.log({ parsed });

    return (
      <LayoutLoader
        layout={parsed}
      />
    );
  }
}

export { Generic };

const mapStateToProps = state => ({
  baseEntities: state.vertx.baseEntities,
});

export default connect( mapStateToProps )( Generic );
