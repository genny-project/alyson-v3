import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { connect } from 'react-redux';
import { LayoutLoader } from '../';

class Sublayout extends Component {
  static propTypes = {
    layoutName: string,
    baseEntities: func,
  };

  getLayout( layoutName ) {
    const { attributes } = this.props.baseEntities;

    /* Find the attribute with the matching URL */
    const layout = Object.keys( attributes )
      .filter( key => key.startsWith( 'LAY_' ))
      .map( key => attributes[key] )
      .find( l => l.PRI_LAYOUT_URI.valueString === layoutName );

    return layout 
    && layout.PRI_LAYOUT_DATA
    && layout.PRI_LAYOUT_DATA.valueString
    && JSON.parse( layout.PRI_LAYOUT_DATA.valueString );
  }

  render() {
    const { layoutName, ...props } = this.props;

    return (
      <LayoutLoader
        layout={this.getLayout( layoutName )}
        sublayoutProps={props}
        sublayout
      />
    );
  }
}

const mapStateToProps = state => ({
  baseEntities: state.vertx.baseEntities,
});

export default connect( mapStateToProps )( Sublayout );
