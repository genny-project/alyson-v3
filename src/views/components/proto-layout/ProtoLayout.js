/* eslint-disable */

import React, { Component } from 'react';
import { object, array, string } from 'prop-types';
import { connect } from 'react-redux';
import dlv from 'dlv';
import { Box, Text, ProtoRecursive } from '../index';
import { isArray, isString, isObject } from '../../../utils';

const defaultStyle = {
  wrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    flex: 1,
  },
  panel: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 'initial',
  },
};

class ProtoLayout extends Component {
  static defaultProps = {
    panels: [
      'NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRE',
    ],
    rootCode: 'FRAME_ROOT',
  }

  static propTypes = {
    frames: object,
    themes: object,
    panels: array,
    rootCode: string,
    inheritedThemes: array,
  }

  state = {
    frames: [],
    themes: [],
  }

  componentDidMount() {
    this.getChildLayouts();
  }

  componentDidUpdate( prevProps ) {
    console.log( 'update', prevProps );
    this.getChildLayouts();
  }

  getChildLayouts = () => {
    const { rootCode, frames } = this.props;

    console.log( 'get' );
    // const layoutBaseEntity = data[rootCode];
    // const layoutAttributes = attributes[rootCode];

    const rootFrame = frames[rootCode];

    if ( !rootFrame ) {
      return null;
    }

    const getLinksOfType = type => {
      return isArray( rootFrame.links, { ofMinLength: 1 })
        ? rootFrame.links.filter( link => link.type === type )
        : [];
    };

    const linkedFrames = getLinksOfType( 'frame' );
    const linkedThemes = getLinksOfType( 'theme' );

    this.checkForChanges( 'frames', this.state.frames, linkedFrames );
    this.checkForChanges( 'themes', this.state.themes, linkedThemes );

    // this.checkForChanges( 'frames', this.state.layouts, linkedFrames );
    // this.checkForChanges( 'themes', this.state.themes, linkedThemes );
  }

  checkForChanges = ( stateKey, oldArray, newArray ) => {
    if ( stateKey ) {
      const prevLinks = ( isArray( oldArray ))
        ? oldArray.map( item => item.code ) : [];
      const newLinks = ( isArray( newArray ))
        ? newArray.map( item => item.code ) : [];

      const toAdd = newLinks.filter( item => !prevLinks.includes( item ));
      const toRemove = prevLinks.filter( item => !newLinks.includes( item ));

      const toChangePanel = [];

      newLinks.filter( x => prevLinks.includes( x )).forEach( item => {
        const oldBe = oldArray.filter( subItem => subItem.code === item )[0];
        const newBe = newArray.filter( subItem => subItem.code === item )[0];

        const isPanelMatch = oldBe.panel ===  newBe.panel;

        if ( !isPanelMatch ) toChangePanel.push( item );
      });

      if (
        toAdd.length > 0 ||
        toRemove.length > 0 ||
        toChangePanel.length > 0
      ) {
        this.updateState( stateKey, newArray );
      }
    }
  };

  updateState = ( stateKey, links ) => {
    console.log( 'update state', stateKey, links );
    this.setState( state => ({
      [stateKey]: [
        // ...state[stateKey]
        ...links,
      ],
    }));
  }

  // addToState = ( stateKey, baseEntityCodes ) => {
  //   // console.log( 'addToState', stateKey, baseEntityCodes );
  //   const { data, attributes, rootCode, panels } = this.props;

  //   if (
  //     stateKey != null &&
  //     isArray( baseEntityCodes, { ofMinLength: 1 })
  //   ) {
  //     baseEntityCodes.forEach( baseEntityCode => {
  //       const link = data[rootCode].links.filter( link => link.link.targetCode )[0];
  //       const baseEntity = data[baseEntityCode];
  //       const baseEntityAttributes = attributes[baseEntityCode];

  //       // console.log( baseEntity, baseEntityAttributes, link );

  //       if (
  //         baseEntity != null &&
  //         baseEntityAttributes != null &&
  //         link != null &&
  //         panels.includes( link.link.linkValue ) &&
  //         this.state[stateKey]
  //           .filter( existingEntity => existingEntity.code === baseEntityCode ) < 1
  //       ) {
  //         this.setState( state => ({
  //           [stateKey]: [
  //             ...state[stateKey],
  //             {
  //               name: baseEntity.name,
  //               code: baseEntityCode,
  //               panel: link.link.linkValue,
  //               weight: link.link.weight,
  //               ...dlv( baseEntityAttributes, 'PRI_CONTENT.value' ) ? { content: baseEntityAttributes.PRI_CONTENT.value } : {},
  //             },
  //           ],
  //         }));
  //       }
  //     });
  //   }
  // }

  arrayCompare = ( x, y ) => {
    if ( !x || !y )
      return false;

    if ( x.length !== y.length )
      return false;

    // loose match - string
    if ( !x.every( x => y.includes( x )))
      return false;

    // exact match - string
    // if ( !x.every(( x, i ) => y[i] === x ))
    //    return false;

    return true;
  }

  render() {
    const { rootCode, panels, inheritedThemes, frames, themes } = this.props;
    // const { frames, themes } = this.state;

    const rootFrame = frames[rootCode];

    if ( !rootFrame ) {
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

    const filterByPanel = ( array, panel ) => {
      return array.filter( item => item.panel === panel );
    };

    const getStyling = ( panel ) => {
      let styling = {};

      if ( isArray( this.state.themes )) {
        filterByPanel( this.state.themes, panel ).forEach( theme => {
          const themeData = dlv( themes, `${theme.code}.data` );

          console.log( 'theme data', theme, themes, themes[theme], themeData );

          if (
            isObject( themeData )
          ) {
            styling = {
              ...inheritedThemes,
              ...styling,
              ...( isObject( themeData ) ? themeData : {}),
            };
          }
        });
      }

      return styling;
    };

    console.log( this.state.frames, this.state.themes );

    return (
      <Box
        id="wrapper"
        {...defaultStyle.wrapper}
      >
        {
          isArray( filterByPanel( this.state.frames, 'NORTH' ), { ofMinLength: 1 })
            ? (
              <Box
                id="north-panel"
                {...defaultStyle.panel}
                width="100%"
                {...isArray( filterByPanel( this.state.frames, 'CENTRE' ), { ofMinLength: 1 })
                  ? {}
                  : { flex: 1 }
                }
                alignItems="flex-start"
                {...getStyling( 'NORTH' )}
              >
                <ProtoRecursive
                  layouts={filterByPanel( this.state.frames, 'NORTH' )}
                  themes={{ ...getStyling( 'NORTH' ) }}
                />
              </Box>
            )
            : null
          }
        {
            isArray( filterByPanel( this.state.frames, 'WEST' ), { ofMinLength: 1 }) ||
            isArray( filterByPanel( this.state.frames, 'CENTRE' ), { ofMinLength: 1 }) ||
            isArray( filterByPanel( this.state.frames, 'EAST' ), { ofMinLength: 1 })
              ? (
                <Box
                  id="row"
                  {...defaultStyle.row}
                >
                  {
                    isArray( filterByPanel( this.state.frames, 'WEST' ), { ofMinLength: 1 })
                      ? (
                        <Box
                          id="west-panel"
                          {...defaultStyle.panel}
                          {...isArray( filterByPanel( this.state.frames, 'CENTRE' ), { ofMinLength: 1 })
                            ? {}
                            : { flex: 1 }
                          }
                          justifyContent="flex-start"
                          {...getStyling( 'WEST' )}
                        >
                          <ProtoRecursive
                            layouts={filterByPanel( this.state.frames, 'WEST' )}
                            themes={{ ...getStyling( 'WEST' ) }}
                          />
                        </Box>
                      )
                      : null
                  }
                  {
                    isArray( filterByPanel( this.state.frames, 'CENTRE' ), { ofMinLength: 1 })
                      ? (
                        <Box
                          id="centre-panel"
                          {...defaultStyle.panel}
                          flex={1}
                          {...getStyling( 'CENTRE' )}
                        >
                          <ProtoRecursive
                            layouts={filterByPanel( this.state.frames, 'CENTRE' )}
                            themes={{ ...getStyling( 'CENTRE' ) }}
                          />
                        </Box>
                      )
                      : null
                  }
                  {
                    isArray( filterByPanel( this.state.frames, 'EAST' ), { ofMinLength: 1 })
                      ? (
                        <Box
                          id="east-panel"
                          {...defaultStyle.panel}
                          {...isArray( filterByPanel( this.state.frames, 'CENTRE' ), { ofMinLength: 1 })
                            ? {}
                            : { flex: 1 }
                          }
                          justifyContent="flex-end"
                          {...getStyling( 'EAST' )}
                        >
                          <ProtoRecursive
                            layouts={filterByPanel( this.state.frames, 'EAST' )}
                            themes={{ ...getStyling( 'EAST' ) }}
                          />
                        </Box>
                      )
                      : null
                  }
                </Box>
              )
              : null
          }
        {
            isArray( filterByPanel( this.state.frames, 'SOUTH' ), { ofMinLength: 1 })
              ? (
                <Box
                  id="south-panel"
                  {...defaultStyle.panel}
                  width="100%"
                  {...isArray( filterByPanel( this.state.frames, 'CENTRE' ), { ofMinLength: 1 })
                    ? {}
                    : { flex: 1 }
                  }
                  alignItems="flex-end"
                  {...getStyling( 'SOUTH' )}
                >
                  <ProtoRecursive
                    layouts={filterByPanel( this.state.frames, 'SOUTH' )}
                    themes={{ ...getStyling( 'SOUTH' ) }}
                  />
                </Box>
              )
              : null
          }
      </Box>
    );
  }
}

export { ProtoLayout };

const mapStateToProps = state => ({
  baseEntities: state.vertx.baseEntities.data,
  themes: state.vertx.layouts.themes,
  frames: state.vertx.layouts.frames,
});

export default connect( mapStateToProps )( ProtoLayout );
