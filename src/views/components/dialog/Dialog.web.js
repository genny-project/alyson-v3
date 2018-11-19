import '@reach/dialog/styles.css';
import React, { Component, Fragment } from 'react';
import { object, func } from 'prop-types';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hideDialog } from '../../../redux/actions';
import { LayoutLoader, LayoutFetcher, Touchable, Icon } from '../../components';

class Dialog extends Component {
  static propTypes = {
    dialog: object,
    hideDialog: func,
  }

  handleDismiss = layoutName => () => {
    this.props.hideDialog({ layoutName });
  }

  render() {
    const { dialog } = this.props;

    return (
      <Fragment>
        {Object.keys( dialog ).reduce(( result, key ) => {
          const modal = dialog[key];

          if ( !modal || !modal.show )
            return result;

          return (
            <DialogOverlay
              key={key}
              isOpen={modal && modal.show}
              onDismiss={this.handleDismiss( key )}
              ref={r => {
                /*
                * This is an override to allow the Uppy plugin to bypass the focus-trap.
                * The focus-trap that is part of the Reach Dialog prevents the dialog
                * from being unfocused by preventing clicks from occuring on elements
                * that are outside the Reach Dialog overlay. This however stops elements
                * that are rendered outside of the Reach Dialog in a portal (like Uppy)
                * from receiving clicks events.
                *
                * We bypass this by overwriting the .contains function to allow the
                * focus-trap to think that the Uppy dialog is rendered inside it
                * when in reality it isn't.
                *
                * Ideally this should be removed when a fix for the following issue
                * is implemented: https://github.com/reach/reach-ui/issues/83
                */
                if ( !r ) {
                  return;
                }

                const original = r.contains.bind( r );

                r.contains = ( element ) => {
                  if (
                    element.className &&
                    element.className.startsWith( 'uppy-' )
                  ) {
                    return true;
                  }

                  return original( element );
                };
              }}
            >
              <DialogContent>
                <Touchable
                  withFeedback
                  onPress={this.handleDismiss( key )}
                  padding={5}
                  width="100%"
                  justifyContent="flex-end"
                >
                  <Icon
                    name="close"
                    size="xs"
                    color="black"
                  />
                </Touchable>

                <LayoutFetcher
                  currentUrl={key}
                  isDialog
                >
                  {layout => (
                    <LayoutLoader
                      isDialog
                      layout={layout}
                      context={{ dialog: modal }}
                    />
                  )}
                </LayoutFetcher>
              </DialogContent>
            </DialogOverlay>
          );
        }, [] )}
      </Fragment>
    );
  }
}

Dialog.propTypes = {
  dialog: object,
};

const mapStateToProps = state => ({
  dialog: state.dialog,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ hideDialog }, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( Dialog );
