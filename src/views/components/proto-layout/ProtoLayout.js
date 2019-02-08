/* eslint-disable */

import React, { Component } from 'react';
import { object, array, string } from 'prop-types';
import { connect } from 'react-redux';
import dlv from 'dlv';
import { Box, Text, ProtoRecursive } from '../index';
import { isArray, isString, isObject } from '../../../utils';

class ProtoLayout extends Component {
  static defaultProps = {
    sections: [
      'NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRE',
    ],
    rootCode: 'TEST_LAYOUT_ROOT',
  }

  static propTypes = {
    data: object,
    attributes: object,
    sections: array,
    rootCode: string,
  }

  state = {
    NORTH: [],
    SOUTH: [],
    EAST: [],
    WEST: [],
    CENTRE: [],
    themes: {
      NORTH: [],
      SOUTH: [],
      EAST: [],
      WEST: [],
      CENTRE: [],
    },
  }

  componentDidUpdate( prevProps ) {
    this.getChildLayouts();
  }

  getChildLayouts = () => {
    const { data, attributes, rootCode, sections } = this.props;
    const { items } = this.state;

    const layoutBaseEntity = data[rootCode];
    const layoutAttributes = attributes[rootCode];

    if ( !layoutBaseEntity || !layoutAttributes ) {
      return (
        <Box
          justifyContent="center"
          alignItems="center"
          flex={1}
        >
          <Text
            text="No Layout Found"
          />
        </Box>
      );
    }

    const linkedThemes = [];
    const linkedLayouts = [];

    if ( isArray( layoutBaseEntity.links, { ofMinLength: 1 })) {
      layoutBaseEntity.links.forEach( x => {
        if ( x.link.attributeCode === 'LNK_LAYOUT' ) {
          linkedLayouts.push({
            link: x,
            baseEntity: data[x.link.targetCode],
          });
        }
        else if ( x.link.attributeCode === 'LNK_THEME' ) {
          linkedThemes.push({
            link: x,
            baseEntity: data[x.link.targetCode],
          });
        }
      });
    }

    if ( isArray( linkedLayouts, { ofMinLength: 1 })) {
      linkedLayouts.forEach( x => {
        if (
          dlv( x, 'link.link.linkValue' ) != null &&
          sections.includes( x.link.link.linkValue ) &&
          dlv( x, 'baseEntity.code' ) != null &&
          !this.state[x.link.link.linkValue].includes( x.baseEntity.code )
        ) {
          console.log( x.link.link.linkValue, x.baseEntity.code );
          this.setState( state => ({
            [x.link.link.linkValue]: [
              ...state[x.link.link.linkValue],
              x.baseEntity.code,
            ],
          }));
        }
      });
    }

    if ( isArray( linkedThemes, { ofMinLength: 1 })) {
      linkedThemes.forEach( x => {
        if (
          dlv( x, 'link.link.linkValue' ) != null &&
          sections.includes( x.link.link.linkValue ) &&
          dlv( x, 'baseEntity.code' ) != null &&
          !this.state.themes[x.link.link.linkValue].includes( x.baseEntity.code )
        ) {
          console.log( x.link.link.linkValue, x.baseEntity.code );
          this.setState( state => ({
            themes: {
              ...state.themes,
              [x.link.link.linkValue]: [
                ...state[x.link.link.linkValue],
                x.baseEntity.code,
              ],
            },
          }));
        }
      });
    }
    // console.log( layoutBaseEntity, layoutAttributes, linkedThemes, linkedLayouts );
  }

  render() {
    const { data, attributes, rootCode, sections } = this.props;
    const { items } = this.state;

    const layoutBaseEntity = data[rootCode];
    const layoutAttributes = attributes[rootCode];

    if ( !layoutBaseEntity || !layoutAttributes ) {
      return (
        <Box
          justifyContent="center"
          alignItems="center"
          flex={1}
        >
          <Text
            text="No Layout Found"
          />
        </Box>
      );
    }

    // const layoutBaseEntities = [];
    // const themeBaseEntities = [];

    // Object.keys( data ).forEach( key => {
    //   if ( key.startsWith( 'TEST_LAYOUT' )) {
    //     layouts.push(
    //       data[key]
    //     );
    //   }
    // });

    // Object.keys( data ).forEach( key => {
    //   if ( key.startsWith( 'THEME' )) {
    //     themes.push(
    //       data[key]
    //     );
    //   }
    // });

    const centreThemes = this.state.themes.CENTRE.map( x => {
      console.log( 'getthemedata' );
      console.log( attributes[x], dlv( attributes, `${x}.PRI_CONTENT.value` ));

      if (
        attributes[x] &&
        dlv( attributes, `${x}.PRI_CONTENT.value` ) != null
      ) {
        const themeData = dlv( attributes, `${x}.PRI_CONTENT.value` );

        console.log( themeData );

        return themeData;
      }
    });

    let centreStyling = {};

    console.log( centreThemes );

    if ( isArray( centreThemes, { ofMinLength: 1 })) {
      centreThemes.forEach( x => {
        console.log( x );
        centreStyling = {
          ...centreStyling,
          ...x,
        };
      });
    }
    console.log( centreStyling );

    console.log( this.state );

    return (
      <Box
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100%"
        flex={1}
      >
        <Box
          justifyContent="center"
          alignItems="center"
          flex={1}
        >
          <Text
            text="North"
          />
        </Box>
        <Box
          flexDirection="row"
          width="100%"
          flex={1}
        >
          <Box
            justifyContent="center"
            alignItems="center"
            flex={1}
          >
            <Text
              text="West"
            />
          </Box>
          <Box
            justifyContent="center"
            alignItems="center"
            flex={1}
            {...centreStyling}
          >
            {
              isArray( this.state.CENTRE, { ofMinLength: 1 })
                ? (
                  <ProtoRecursive
                    layouts={this.state.CENTRE}
                  />
                )
                : (
                  <Text
                    text="Centre"
                  />
                )
            }
          </Box>
          <Box
            justifyContent="center"
            alignItems="center"
            flex={1}
          >
            <Text
              text="East"
            />
          </Box>
        </Box>
        <Box
          justifyContent="center"
          alignItems="center"
          flex={1}
        >
          <Text
            text="South"
          />
        </Box>
      </Box>
    );
  }
}

export { ProtoLayout };

const mapStateToProps = state => ({
  data: state.vertx.baseEntities.data,
  attributes: state.vertx.baseEntities.attributes,
});

export default connect( mapStateToProps )( ProtoLayout );
