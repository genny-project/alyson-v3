import { Component } from 'react';
import { connect } from 'react-redux';
import { object, func, string } from 'prop-types';

class LayoutFetcher extends Component {
  static propTypes = {
    baseEntities: object.isRequired,
    children: func.isRequired,
    currentUrl: string.isRequired,
  };

  render() {
    const { currentUrl, baseEntities } = this.props;
    const { attributes } = baseEntities;

    const layoutAttribute = Object.keys( attributes ).find( attribute => {
      if ( attribute.startsWith( 'LAY' )) {
        const layoutUrl = attributes[attribute].PRI_LAYOUT_URI.valueString;

        if (
          layoutUrl === currentUrl ||
          (
            layoutUrl.endsWith( '/' ) &&
            layoutUrl.substr( 0, layoutUrl.length - 1 ) === currentUrl
          )
        ) {
          return true;
        }
      }

      return false;
    });

    const layout = (
      attributes[layoutAttribute] != null &&
      attributes[layoutAttribute].PRI_LAYOUT_DATA &&
      attributes[layoutAttribute].PRI_LAYOUT_DATA.valueString
    );

    let parsed = null;

    try {
      parsed = JSON.parse( layout );
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
