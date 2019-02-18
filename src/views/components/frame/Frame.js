/* eslint-disable */

import React, { Component } from 'react';
import { object, array, string } from 'prop-types';
import { connect } from 'react-redux';
import dlv from 'dlv';
import { Box, Text, Recurser } from '../index';
import Panel from './panel';
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
  },
  north: {
    width: '100%',
    alignItems: 'flex-start',
  },
  south: {
    width: '100%',
    alignItems: 'flex-end',
  },
  east: {
    justifyContent: 'flex-end',
  },
  west: {
    justifyContent: 'flex-start',
  },
  centre: {
    flex: 1,
  },
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
          if ( isObject( dlv( nextProps, `${item.type === 'ask' ? 'asks' : `${item.type}s`}.${item.code}` ))) {
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
          dlv( this.props, `${link.type === 'ask' ? 'asks' : `${link.type}s`}.${link.code}` ) != null
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

    const getStylingByPanel = ( panel, onlyInheritableThemes ) => {
      let styling = {
        ...isObject( inheritedThemes ) ? inheritedThemes : {},
      };

      if ( isArray( this.state.themes )) {
        filterByPanel( this.state.themes, panel ).forEach( theme => {
          const themeData = dlv( themes, `${theme.code}.data` );
          const themeIsInheritable = dlv( themes, `${theme.code}.isInheritable` );

          console.log
          if ( onlyInheritableThemes && !themeIsInheritable ) return;

          styling = {
            ...styling,
            ...( isObject( themeData ) ? themeData : {}),
          };
        });
      }

      return styling;
    };

    const getStylingInheritable = ( panel ) => {
      return getStylingByPanel( panel, true );
    };

    const panelContent = this.state.frames.concat( this.state.asks );

    const hasContent = ( panel ) => {
      return isArray( filterByPanel( panelContent, panel ), { ofMinLength: 1 });
    };

    /* Compile  all styling for the panel*/
    const getStyling = ( panel ) => {
      return {
        ...defaultStyle.panel,
        ...defaultStyle[panel],
        /* If the centre panel is rendered, then it is the only panel that expands.
          If not, then the other panels need to have flex 1 to expand. */
        ...hasContent( 'CENTRE' ) ? {} : { flex: 1 },
        ...getStylingByPanel( panel.toUpperCase()),
      }
    }

    const isExpandable = ( panel ) => isArray( rootFrame.expandablePanels ) ? rootFrame.expandablePanels.includes(panel) : false ;

    return (
      <Box
        id="wrapper"
        {...defaultStyle.wrapper}
      >
        {
          hasContent( 'NORTH' )
            ? (
              <Panel
                rootCode={rootCode}
                location={'NORTH'}
                style={getStyling( 'north' )}
                isExpandable={isExpandable('NORTH')}
              >
                <Recurser
                  children={filterByPanel( panelContent, 'NORTH' )}
                  themes={{ ...getStylingInheritable( 'NORTH' ) }}
                />
              </Panel>
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
                        <Panel
                          rootCode={rootCode}
                          location={'WEST'}
                          style={getStyling( 'west' )}
                          isExpandable={isExpandable('WEST')}
                        >
                          <Recurser
                            children={filterByPanel( panelContent, 'WEST' )}
                            themes={{ ...getStylingInheritable( 'WEST' ) }}
                          />
                        </Panel>
                      )
                      : null
                  }
                  {
                    hasContent( 'CENTRE' )
                      ? (
                        <Panel
                          rootCode={rootCode}
                          location={'CENTRE'}
                          style={getStyling( 'centre' )}
                          isExpandable={isExpandable('CENTRE')}
                        >
                          <Recurser
                            children={filterByPanel( panelContent, 'CENTRE' )}
                            themes={{ ...getStylingInheritable( 'CENTRE' ) }}
                          />
                        </Panel>
                      )
                      : null
                  }
                  {
                    hasContent( 'EAST' )
                      ? (
                        <Panel
                          rootCode={rootCode}
                          location={'EAST'}
                          style={getStyling( 'east' )}
                          isExpandable={isExpandable('EAST')}
                        >
                          <Recurser
                            children={filterByPanel( panelContent, 'EAST' )}
                            themes={{ ...getStylingInheritable( 'EAST' ) }}
                          />
                        </Panel>
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
                <Panel
                  rootCode={rootCode}
                  location={'SOUTH'}
                  style={getStyling( 'south' )}
                  isExpandable={isExpandable('SOUTH')}
                >
                  <Recurser
                    children={filterByPanel( panelContent, 'SOUTH' )}
                    themes={{ ...getStylingInheritable( 'SOUTH' ) }}
                  />
                </Panel>
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
  asks: state.vertx.asks,
  themes: state.vertx.layouts.themes,
  frames: state.vertx.layouts.frames,
});

export default connect( mapStateToProps )( Frame );
