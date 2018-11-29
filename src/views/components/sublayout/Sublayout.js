import React, { Component } from 'react';
import { string, object, func } from 'prop-types';
import { connect } from 'react-redux';
import { LayoutLoader } from '../';

class Sublayout extends Component {
  static propTypes = {
    layoutName: string,
    layouts: object,
    dispatch: func,
  };

  state = {
    layout: null,
  }

  componentDidMount() {
    this.getLayout();
  }

  componentDidUpdate() {
    if ( !this.state.layout )
      this.getLayout();
  }

  getLayout() {
    const { layouts, layoutName } = this.props;
    const layout = layouts.sublayouts[layoutName];

    if ( layout )
      this.setState({ layout });
    else {
      // eslint-disable-next-line no-console
      console.warn( 'layout not found', { layoutName });
    }
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { layouts, dispatch, layoutName, ...restProps } = this.props;
    const { layout } = this.state;

    return (
      <LayoutLoader
        layout={layout}
        sublayoutProps={restProps}
        sublayout
      />
    );
  }
}

const mapStateToProps = state => ({
  layouts: state.vertx.layouts,
});

export default connect( mapStateToProps )( Sublayout );
