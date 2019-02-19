/* eslint-disable */

import React, { Component } from 'react';
import { object, node, string } from 'prop-types';
import { connect } from 'react-redux';
import { store } from '../../../../redux';
import { Box, Fragment, Icon, Touchable } from '../../index';
import { isObject } from '../../../../utils';

class Panel extends Component {
  static defaultProps = {
    location: 'centre',
    style: {},
  }

  static propTypes = {
    children: node,
    location: string,
    style: object,
    aliases: object,
  }

  // state = {
  //   maximised: false,
  // }

  handleToggleMaximised = () => {
    // this.setState( state => ({
    //   maximised: !state.maximised,
    // }))

    store.dispatch(
      {
        type: "ALIAS_TOGGLE",
        payload: {
          alias: "FULLSCREEN_PANEL",
          value: `${this.props.rootCode}-${this.props.location}`
        }
      }
    );

    /* send event to backend with:
      * userCode
      * be Code
      * panel Code
      * eventCode
    */

    /*
      backend needs to send back
      1/ Theme for Fullscreen
      2/ Link to Be, with linkValue Panel
      3/ Update the Fullscreen Alias
    */
  }



  render() {
    const { rootCode, children, location, style, aliases, isExpandable } = this.props;
    const currentFullscreenCode = aliases['FULLSCREEN_PANEL'];

    const isFullscreen = `${rootCode}-${location}` === currentFullscreenCode && rootCode != null;

    const Wrapper = isExpandable ? 'div' : Fragment;

    return (
      <Box
        test-id={`rootCode-${location}-panel`}
        {...isExpandable ? { position: 'relative' } : {}}
        {...style}
      >
        {
          isExpandable
            ? (
              <Box
                position="absolute"
                top={0}
                right={-2}
                zIndex={isObject(style , { withProperty: 'zIndex' }) ? style.zIndex + 1 : 'auto'}
              >
                <Touchable
                  onPress={this.handleToggleMaximised}
                  withFeedback
                  opacity={0}
                  hoverProps={{
                    style: {
                      opacity: 0.5
                    }
                  }}
                >
                  <Box
                    padding={5}
                  >
                    <Icon
                      size="sm"
                      color="black"
                      name={`fullscreen${isFullscreen ? '_exit' : ''}`}
                    />
                  </Box>
                  {/* <Box
                    transform="rotate(270deg)"
                  >
                    <Icon
                      size="sm"
                      color="black"
                      name="signal_cellular_4_bar"
                    />
                  </Box> */}
                </Touchable>
              </Box>
            ) : null
        }
        {children}
      </Box>
    );
  }
}

export { Panel };

const mapStateToProps = state => ({
  aliases: state.vertx.aliases,
});

export default connect( mapStateToProps )( Panel );