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

  render() {
    const { currentUrl, baseEntities } = this.props;
    const { attributes } = baseEntities;
    const strippedCurrentUrl = removeStartingAndEndingSlashes( currentUrl );

    const layoutAttribute = Object.keys( attributes ).find( attribute => {
      if ( attribute.startsWith( 'LAY' )) {
        const layoutUrl = (
          attributes[attribute] &&
          attributes[attribute].PRI_LAYOUT_URI &&
          attributes[attribute].PRI_LAYOUT_URI.valueString
        );

        if ( !layoutUrl ) {
          return false;
        }

        const strippedLayoutUrl = removeStartingAndEndingSlashes( layoutUrl );

        if ( strippedLayoutUrl === strippedCurrentUrl ) {
          return true;
        }
      }

      return false;
    });

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
