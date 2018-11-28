import React, { Component } from 'react';
import { string, object } from 'prop-types';
import { connect } from 'react-redux';
import { LayoutLoader } from '../';
import { isString } from '../../../utils';

class Sublayout extends Component {
  static propTypes = {
    layoutName: string,
    layouts: object,
  };

  state = {
    layout: null,
  }

  componentDidMount() {
    this.getLayout();
  }

  componentDidUpdate( prevProps ) {
    if (
      isString( this.props.layoutName ) &&
      isString( prevProps.layoutName ) &&
      this.props.layoutName !== prevProps.layoutName
    ) {
      this.getLayout();
    }
  }

  getLayout() {
    const { layouts, layoutName } = this.props;
    const layout = layouts.sublayouts[layoutName];

    if ( layout ) {
      this.setState({ layout });
    }
    else {
      console.warn( 'layout not found', { layoutName });
    }
  }

  render() {
    const { layout } = this.state;

    return (
      <LayoutLoader
        layout={layout}
        sublayoutProps={this.props}
        sublayout
      />
    );
  }
}

const mapStateToProps = state => ({
  layouts: state.vertx.layouts,
});

export default connect( mapStateToProps )( Sublayout );
