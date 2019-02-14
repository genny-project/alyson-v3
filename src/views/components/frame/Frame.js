/* eslint-disable */

import React, { Component } from 'react';
import { object, array, string } from 'prop-types';
import { connect } from 'react-redux';
import dlv from 'dlv';
import { Box, Text, Recurser } from '../index';
import { isArray, isString, isObject } from '../../../utils';
import shallowCompare from '../../../utils/shallow-compare';

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
  }
};

class Frame extends Component {
  static defaultProps = {
    panels: [
      'NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRE',
    ],
    linkTypes: [
      'asks', 'frames', 'themes',
    ],
    inheritedThemes: {},
  }

  static propTypes = {
    frames: object,
    themes: object,
    panels: array,
    linkTypes: array,
    rootCode: string,
    inheritedThemes: object,
  }

  state = {
    frames: [],
    asks: [],
    themes: [],
  }

  componentDidMount() {
    this.getChildLayouts();
  }

  shouldComponentUpdate( nextProps, nextState ) {

    /* If rootCode is different, then a different base entity needs to be rendered inside the frame */
    if ( this.props.rootCode !== nextProps.rootCode ) {
      return true;
    }

    /* Check if any of the links of the root base entity have changed */
    if (  isObject( dlv( nextProps, `frames.${nextProps.rootCode}` ))) {
      /* Valid links are added to the state key that matches their link type, so check all the state arrays together */
      const oldArray = this.state.frames.concat( this.state.asks, this.state.themes );
      const newArray = dlv( nextProps, `frames.${nextProps.rootCode}.links` );

      const prevLinks = [];
      const newLinks = [];

      /* Get just the target codes */
      if ( isArray( oldArray )) {
        oldArray.forEach( item => {
          prevLinks.push( item.code );
        });
      }

      if ( isArray( newArray )) {
        newArray.forEach( item => {
          /* Ask Bes are being passed to Frame via the baseEntity prop, while frames and themes have their own props
            so we need to check where we are looking for a base entity. If no entity is found that matches the
            target code  of the link, it is not added to the array of new links */
          if ( isObject( dlv( nextProps, `${item.type === 'ask' ? 'baseEntities' : `${item.type}s`}.${item.code}` ))) {
            newLinks.push( item.code );
          }
        });
      }

      /* Find the differences between the two sets of links */
      const toAdd = newLinks.filter( item => !prevLinks.includes( item ));
      const toRemove = prevLinks.filter( item => !newLinks.includes( item ));

      const toChangePanel = [];

      /* For items that have the same target, check if the panel ( linkValue ) is the same*/
      newLinks.filter( newLinkCode => prevLinks.includes( newLinkCode )).forEach( newLinkCode => {
        const oldBe = oldArray.filter( link => link.code === newLinkCode )[0];
        const newBe = newArray.filter( link => link.code === newLinkCode )[0];

        const isPanelMatch = oldBe.panel ===  newBe.panel;

        if ( !isPanelMatch ) toChangePanel.push( item );
      });

      /* if any changes are found, update */
      if (
        toAdd.length > 0 ||
        toRemove.length > 0 ||
        toChangePanel.length > 0
      ) {
        return true;
      }
    }

    /* Check if the inherited themes have changed */
    if (
      isObject(nextProps.inheritedThemes) &&
     !shallowCompare( this.props.inheritedThemes , nextProps.inheritedThemes )
    ) {
      return true;
    }

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

    /* filter each of the links based on their type */
    const linkedFrames = getLinksOfType( 'frame' );
    const linkedAsks = getLinksOfType( 'ask' );
    const linkedThemes = getLinksOfType( 'theme' );

    /* update the state  */
    this.updateLinks( 'frames', linkedFrames );
    this.updateLinks( 'asks', linkedAsks );
    this.updateLinks( 'themes', linkedThemes );
  }

  updateLinks = ( stateKey, links ) => {
    /* check if the stateKey is valid  */
    if ( this.props.linkTypes.includes( stateKey )){
      this.setState({
        [stateKey]: [
          ...links,
        ],
      }, () => {});
    }
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
            text="No Base Entity Found"
          />
        </Box>
      );
    }

    const filterByPanel = ( array, panel ) => {
      return array.filter( item => item.panel === panel );
    };

    const getStyling = ( panel ) => {
      let styling = {
        ...isObject( inheritedThemes ) ? inheritedThemes : {},
      };

      if ( isArray( this.state.themes )) {
        filterByPanel( this.state.themes, panel ).forEach( theme => {
          const themeData = dlv( themes, `${theme.code}.data` );

          styling = {
            ...styling,
            ...( isObject( themeData ) ? themeData : {}),
          };
        });
      }

      return styling;
    };

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
                <Recurser
                  children={filterByPanel( panelContent, 'NORTH' )}
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
                          <Recurser
                            children={filterByPanel( panelContent, 'WEST' )}
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
                          <Recurser
                            children={filterByPanel( panelContent, 'CENTRE' )}
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
                          <Recurser
                            children={filterByPanel( panelContent, 'EAST' )}
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
                  <Recurser
                    children={filterByPanel( panelContent, 'SOUTH' )}
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

export { Frame };

const mapStateToProps = state => ({
  baseEntities: state.vertx.baseEntities.data,
  themes: state.vertx.layouts.themes,
  frames: state.vertx.layouts.frames,
});

export default connect( mapStateToProps )( Frame );
