/**
 *
 * TODO
 *
 */

/* eslint-disable */

import React, { Component } from 'react';
import { object } from 'prop-types';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LayoutLoader } from '../../components';


class Dialog extends Component {
  render() {
    return null;
  }
}

Dialog.propTypes = {
  dialog: object,
};

const mapStateToProps = state => ({
  dialog: state.dialog,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( Dialog );
