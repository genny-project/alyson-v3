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
    asks: [],
    themes: [],
  }

  componentDidMount() {
    // if ( this.props.rootCode === 'FRAME_SIDEBAR' )  console.log( 'mount', this.props.rootCode );
    this.getChildLayouts();
  }

  shouldComponentUpdate( nextProps, nextState ) {
    // if ( this.props.rootCode === 'FRAME_ROOT' )  console.log( '================================' );
    // if ( this.props.rootCode === 'FRAME_ROOT' )  console.log( this.state.frames.concat( this.state.asks, this.state.themes ));
    const oldArray = this.state.frames.concat( this.state.asks, this.state.themes );
    const newArray = dlv( nextProps, `frames.${nextProps.rootCode}.links` );

    const prevLinks = [];
    const newLinks = [];

    if ( isArray( oldArray )) {
      oldArray.forEach( item => {
        // if ( this.props.rootCode === 'FRAME_ROOT' )  console.log( item );
        prevLinks.push( item.code );
      });
    }

    if ( isArray( newArray )) {
      // if ( this.props.rootCode === 'FRAME_SIDEBAR' ) console.log( 'newArray', newArray );

      newArray.forEach( item => {
        // if ( this.props.rootCode === 'FRAME_ROOT' ) {
        //   if ( this.props.rootCode === 'FRAME_ROOT' )  console.log( 'item', item );
        //   if ( this.props.rootCode === 'FRAME_ROOT' )  console.log( 'dlv', dlv( nextProps, `${item.type === 'ask' ? 'baseEntities' : `${item.type}s`}.${item.code}` ));
        //   if ( this.props.rootCode === 'FRAME_ROOT' )  console.log( 'isobject', isObject( dlv( nextProps, `${item.type === 'ask' ? 'baseEntities' : `${item.type}s`}.${item.code}` )));
        // }

        if ( isObject( dlv( nextProps, `${item.type === 'ask' ? 'baseEntities' : `${item.type}s`}.${item.code}` ))) {
          // if ( this.props.rootCode === 'FRAME_SIDEBAR' ) console.log( 'newLink' );
          newLinks.push( item.code );
        }
      });
    }

    // if ( this.props.rootCode === 'FRAME_ROOT' )  console.log( 'newlinks', prevLinks, newLinks );

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
      // if ( this.props.rootCode === 'FRAME_ROOT' ) console.log( 'CHANGES', this.props.rootCode, toAdd, toRemove, toChangePanel );

      return true;
    }
    // if ( this.props.rootCode === 'FRAME_ROOT' ) console.log( 'NO CHANGES', this.props.rootCode, this.state.themes );

    return false;
  }

  componentDidUpdate( prevProps ) {
    this.getChildLayouts();
  }

  getChildLayouts = () => {
    const { rootCode, frames } = this.props;
    const rootFrame = frames[rootCode];

    if ( !rootFrame ) {
      return null;
    }

    const getLinksOfType = type => {
      return isArray( rootFrame.links, { ofMinLength: 1 })
        ? rootFrame.links.filter( link => (
          link.type === type &&
          dlv( this.props, `${link.type === 'ask' ? 'baseEntities' : `${link.type}s`}.${link.code}` ) != null
        ))
        : [];
    };

    const linkedFrames = getLinksOfType( 'frame' );
    const linkedAsks = getLinksOfType( 'ask' );
    const linkedThemes = getLinksOfType( 'theme' );


    // if ( this.props.rootCode === 'FRAME_ROOT' ) console.log( 'links', linkedFrames, linkedAsks, linkedThemes );

    this.checkForChanges( 'frames', this.state.frames, linkedFrames );
    this.checkForChanges( 'asks', this.state.asks, linkedAsks );
    this.checkForChanges( 'themes', this.state.themes, linkedThemes );
  }

  checkForChanges = ( stateKey, oldArray, newArray ) => {
    // if ( this.props.rootCode === 'FRAME_SIDEBAR' ) console.log( 'checkForChanges', stateKey, oldArray, newArray );
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
    this.setState({
      [stateKey]: [
        // ...state[stateKey]
        ...links,
      ],
    }, () => {});
  }

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

      // if ( rootCode === 'FRAME_ROOT' ) console.log( this.state.themes );

      if ( isArray( this.state.themes )) {
        filterByPanel( this.state.themes, panel ).forEach( theme => {
          const themeData = dlv( themes, `${theme.code}.data` );

          // if ( rootCode === 'FRAME_ROOT' ) console.log( themes, Object.keys( themes ).join(), Object.keys( themes ).length, theme, theme.code, themes[theme.code], themeData );

          styling = {
            ...inheritedThemes,
            ...styling,
            ...( isObject( themeData ) ? themeData : {}),
          };
        });
      }

      // if (rootCode === 'FRAME_MAIN') console.log( 'styling', styling, panel );
      return styling;
    };

    // console.log( this.state.frames, this.state.themes );

    const panelContent = this.state.frames.concat( this.state.asks );

    const hasContent = ( panel ) => {
      return isArray( filterByPanel( panelContent, panel ), { ofMinLength: 1 });
    };

    return (
      <Box
        id="wrapper"
        {...defaultStyle.wrapper}
      >
        {
          hasContent( 'NORTH' )
            ? (
              <Box
                id="north-panel"
                {...defaultStyle.panel}
                width="100%"
                {...hasContent( 'CENTRE' )
                  ? {}
                  : { flex: 1 }
                }
                alignItems="flex-start"
                {...getStyling( 'NORTH' )}
              >
                <ProtoRecursive
                  layouts={filterByPanel( panelContent, 'NORTH' )}
                  themes={{ ...getStyling( 'NORTH' ) }}
                />
              </Box>
            )
            : null
          }
        {
            hasContent( 'WEST' ) ||
            hasContent( 'CENTRE' ) ||
            hasContent( 'EAST' )
              ? (
                <Box
                  id="row"
                  {...defaultStyle.row}
                >
                  {
                    hasContent( 'WEST' )
                      ? (
                        <Box
                          id="west-panel"
                          {...defaultStyle.panel}
                          {...hasContent( 'CENTRE' )
                            ? {}
                            : { flex: 1 }
                          }
                          justifyContent="flex-start"
                          {...getStyling( 'WEST' )}
                        >
                          <ProtoRecursive
                            layouts={filterByPanel( panelContent, 'WEST' )}
                            themes={{ ...getStyling( 'WEST' ) }}
                          />
                        </Box>
                      )
                      : null
                  }
                  {
                    hasContent( 'CENTRE' )
                      ? (
                        <Box
                          id="centre-panel"
                          {...defaultStyle.panel}
                          flex={1}
                          {...getStyling( 'CENTRE' )}
                        >
                          <ProtoRecursive
                            layouts={filterByPanel( panelContent, 'CENTRE' )}
                            themes={{ ...getStyling( 'CENTRE' ) }}
                          />
                        </Box>
                      )
                      : null
                  }
                  {
                    hasContent( 'EAST' )
                      ? (
                        <Box
                          id="east-panel"
                          {...defaultStyle.panel}
                          {...hasContent( 'CENTRE' )
                            ? {}
                            : { flex: 1 }
                          }
                          justifyContent="flex-end"
                          {...getStyling( 'EAST' )}
                        >
                          <ProtoRecursive
                            layouts={filterByPanel( panelContent, 'EAST' )}
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
            hasContent( 'SOUTH' )
              ? (
                <Box
                  id="south-panel"
                  {...defaultStyle.panel}
                  width="100%"
                  {...hasContent( 'CENTRE' )
                    ? {}
                    : { flex: 1 }
                  }
                  alignItems="flex-end"
                  {...getStyling( 'SOUTH' )}
                >
                  <ProtoRecursive
                    layouts={filterByPanel( panelContent, 'SOUTH' )}
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
