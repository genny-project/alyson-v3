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
