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

  state = {
    layout: null,
  }

  componentDidMount() {
    this.getLayout();
  }

  componentDidUpdate( prevProps ) {
    if ( prevProps.currentUrl !== this.props.currentUrl ) {
      this.getLayout();
    }
  }

  getLayout() {
    const { attributes } = this.props.baseEntities;
    const layoutAttribute = Object
      .keys( attributes )
      .filter( this.handleFilterAttributes )
      .sort( this.handleSortAttributes )
      .find( this.findAttribute );

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

        this.setState({ layout: parsed });
      }
    }
    catch ( error ) {
      console.warn( 'Unable to parse layout', layout );
    }
  }

  handleFilterAttributes = attribute => {
    if ( attribute.startsWith( 'LAY_' ))
      return true;

    return false;
  }

  /**
   * Sort the attributes so that the routes which contain
   * a colon (`:`) or a splat / asterisk (`*`) always come
   * last in the list.
   *
   * For example, if we had `load/add` and `load/:id` as our
   * 2 routes, we want to see if the current URL would match
   * `load/add` before the second route as the second route
   * is a wildcard, and anything will match it.
   *
   * TODO: expand this check further so it better compares
   * routes containing multiple colons and asterisks
   *
   * NB: return numbers:
   *   0 - keep the same order
   *   1 - Put A after B
   *   -1 - Put B after A
   */
  handleSortAttributes = ( attributeA, attributeB ) => {
    const { attributes } = this.props.baseEntities;

    const routeA = (
      attributes[attributeA] &&
      attributes[attributeA].PRI_LAYOUT_URI &&
      attributes[attributeA].PRI_LAYOUT_URI.valueString
    );

    if ( !routeA )
      return 0;

    const routeB = (
      attributes[attributeB] &&
      attributes[attributeB].PRI_LAYOUT_URI &&
      attributes[attributeB].PRI_LAYOUT_URI.valueString
    );

    if ( !routeB )
      return 0;

    if (
      routeA.includes( ':' ) &&
      routeB.includes( ':' )
    ) {
      return 0;
    }

    /* Put routeA after layoutB. */
    if ( routeA.includes( ':' ))
      return 1;

    /* Put routeB after layoutA. */
    if ( routeB.includes( ':' ))
      return -1;

    return 0;
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

    const layoutUrl = (
      attributes[attribute] &&
      attributes[attribute].PRI_LAYOUT_URI &&
      attributes[attribute].PRI_LAYOUT_URI.valueString
    );

    if ( !layoutUrl ) {
      return false;
    }

    let strippedLayoutUrl = removeStartingAndEndingSlashes( layoutUrl );

    console.warn({ strippedLayoutUrl, strippedCurrentUrl });

    if ( strippedLayoutUrl.includes( ':' )) {
      const layoutUrlFragments = strippedLayoutUrl.split( '/' );
      const currentUrlFragments = strippedCurrentUrl.split( '/' );

      if ( layoutUrlFragments.length !== currentUrlFragments.length )
        return false;

      strippedLayoutUrl =
        layoutUrlFragments
          .map( this.handleMapUrlFragments( currentUrlFragments ))
          .join( '/' );
    }

    if ( strippedLayoutUrl === strippedCurrentUrl ) {
      return true;
    }
  };

  render() {
    const { layout } = this.state;

    return this.props.children( layout );
  }
}

const mapStateToProps = state => ({
  baseEntities: state.vertx.baseEntities,
});

export default connect( mapStateToProps )( LayoutFetcher );
