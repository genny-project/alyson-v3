import React, { Component } from 'react';
import { string, object } from 'prop-types';
import { connect } from 'react-redux';
import { LayoutLoader } from '../';

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

  componentDidUpdate() {
    if ( !this.state.layout )
      this.getLayout();
  }

  getLayout() {
    const { layouts, layoutName } = this.props;
    const layout = layouts.sublayouts[layoutName];

    if ( layout )
      this.setState({ layout });
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
