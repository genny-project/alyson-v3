import { Component } from 'react';
import { connect } from 'react-redux';
import { object, func, string } from 'prop-types';
import { removeStartingAndEndingSlashes } from '../../../utils';

class LayoutFetcher extends Component {
  static propTypes = {
    baseEntities: object.isRequired,
    children: func.isRequired,
    currentUrl: string.isRequired,
  }

  handleMapUrlFragments = currentUrlFragments => ( fragment, index ) => {
    if ( fragment.startsWith( ':' )) {
      return currentUrlFragments[index];
    }

    return fragment;
  }

  findAttribute = attribute => {
    const { currentUrl, baseEntities } = this.props;
    const { attributes } = baseEntities;
    const strippedCurrentUrl = removeStartingAndEndingSlashes( currentUrl );

    if ( attribute.startsWith( 'LAY_' )) {
      const layoutUrl = (
        attributes[attribute] &&
        attributes[attribute].PRI_LAYOUT_URI &&
        attributes[attribute].PRI_LAYOUT_URI.valueString
      );

      if ( !layoutUrl ) {
        return false;
      }

      let strippedLayoutUrl = removeStartingAndEndingSlashes( layoutUrl );

      if ( strippedLayoutUrl.includes( ':' )) {
        const layoutUrlFragments = strippedLayoutUrl.split( '/' );
        const currentUrlFragments = strippedCurrentUrl.split( '/' );

        if ( layoutUrlFragments.length !== currentUrlFragments.length )
          return;

        strippedLayoutUrl =
          layoutUrlFragments
            .map( this.handleMapUrlFragments( currentUrlFragments ))
            .join( '/' );
      }

      if ( strippedLayoutUrl === strippedCurrentUrl ) {
        return true;
      }
    }

    return false;
  };

  render() {
    const { attributes } = this.props.baseEntities;
    const layoutAttribute = Object.keys( attributes ).find( this.findAttribute );

    const layout = (
      layoutAttribute &&
      attributes[layoutAttribute] &&
      attributes[layoutAttribute].PRI_LAYOUT_DATA &&
      attributes[layoutAttribute].PRI_LAYOUT_DATA.valueString
    );

    let parsed = null;

    try {
      if ( layout ) {
        parsed = JSON.parse( layout );
      }
    }
    catch ( error ) {
      console.warn( 'Unable to parse layout', layout );
    }

    return this.props.children( parsed );
  }
}

const mapStateToProps = state => ({
  baseEntities: state.vertx.baseEntities,
});

export default connect( mapStateToProps )( LayoutFetcher );
