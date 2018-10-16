import '@reach/dialog/styles.css';
import React, { Component, Fragment } from 'react';
import { object, func, string } from 'prop-types';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hideDialog } from '../../../redux/actions';
import { LayoutLoader, LayoutFetcher, Touchable, Icon } from '../../components';

class Dialog extends Component {
  static defaultProps = {
    testID: 'dialog',
  }

  static propTypes = {
    dialog: object,
    hideDialog: func,
    testID: string,
  }

  state = {
    show: [],
  }

  componentDidUpdate( prevProps ) {
    const keys = Object.keys( this.props.dialog );

    keys.forEach( key => {
      const dialog = this.props.dialog[key];

      if ( !this.state.show.includes( key )) {
        this.setState( state => ({
          show: [...state.show, key],
        }));
      }
      else if (
        this.state.show.includes( key ) &&
        ( !prevProps.dialog[key] || !prevProps.dialog[key].show ) !== ( !dialog || !dialog.show )
      ) {
        this.setState( state => ({
          show: state.show.filter( x => x !== key ),
        }));
      }
    });
  }

  handleDismiss = layoutName => () => {
    this.props.hideDialog({ layoutName });
  }

  render() {
    const { dialog, testID } = this.props;
    const { show } = this.state;

    return (
      <Fragment>
        {show.map( key => {
          const modal = dialog[key];

          return (
            <DialogOverlay
              key={key}
              isOpen={modal && modal.show}
              onDismiss={this.handleDismiss( key )}
              testID={testID}
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
                    />
                  )}
                </LayoutFetcher>
              </DialogContent>
            </DialogOverlay>
          );
        })}
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
