import { Component } from 'react';
import { connect } from 'react-redux';
import { object, func, string } from 'prop-types';
import { withNavigation } from 'react-navigation';
import NavigationActions from '../../../utils/navigation-actions';
import { removeStartingAndEndingSlashes } from '../../../utils';

class LayoutFetcher extends Component {
  static propTypes = {
    baseEntities: object.isRequired,
    children: func.isRequired,
    currentUrl: string.isRequired,
    navigation: object,
    navigationReducer: object,
  }

  state = {
    layout: null,
  }

  componentDidMount() {
    this.getLayout();
  }

  shouldComponentUpdate( nextProps ) {
    if ( nextProps.navigation && nextProps.navigation.index != null && nextProps.navigation.routes ) {
      const { index, routes } = nextProps.navigation;
      const strippedCurrentUrl = removeStartingAndEndingSlashes( this.props.currentUrl );
      const strippedLastRoute = removeStartingAndEndingSlashes( routes[index].params.layout );

      return strippedCurrentUrl === strippedLastRoute;
    }

    return true;
  }

  componentDidUpdate( prevProps ) {
    if (
      prevProps.currentUrl !== this.props.currentUrl ||
      !this.state.layout
    ) {
      this.getLayout();
    }
  }

  getAttributes(
    attributes = this.props.baseEntities.attributes
  ) {
    const layoutAttributes =
      Object
        .keys( attributes )
        .filter( this.handleFilterAttributes )
        .sort( this.handleSortAttributes );

    return layoutAttributes;
  }

  getLayout() {
    const { attributes } = this.props.baseEntities;
    const { layoutAttribute } = this.findLayoutAttribute();

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

    if ( parsed )
      this.setState({ layout: parsed });

    // navigator.setParams({
      // params,
      // key: layoutAttribute,
    // });
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

  findLayoutAttribute() {
    const { currentUrl, baseEntities } = this.props;
    const attributes = this.getAttributes();
    const strippedCurrentUrl = removeStartingAndEndingSlashes( currentUrl );
    const params = {};

    const layoutAttribute = attributes.find( attribute => {
      const layoutUrl = (
        baseEntities.attributes[attribute] &&
        baseEntities.attributes[attribute].PRI_LAYOUT_URI &&
        baseEntities.attributes[attribute].PRI_LAYOUT_URI.valueString
      );

      if ( !layoutUrl ) {
        return false;
      }

      let strippedLayoutUrl = removeStartingAndEndingSlashes( layoutUrl );

      if ( strippedLayoutUrl.includes( ':' )) {
        const layoutUrlFragments = strippedLayoutUrl.split( '/' );
        const currentUrlFragments = strippedCurrentUrl.split( '/' );

        if ( layoutUrlFragments.length !== currentUrlFragments.length )
          return false;

        /* Keep locally so we add the params. */
        const handleMapUrlFragments = ( fragment, index ) => {
          if ( fragment.startsWith( ':' )) {
            /* Remove the colon at the start. */
            const param = fragment.substr( 1 );

            params[param] = currentUrlFragments[index];

            return currentUrlFragments[index];
          }

          return fragment;
        };

        strippedLayoutUrl =
          layoutUrlFragments
            .map( handleMapUrlFragments )
            .join( '/' );
      }

      if ( strippedLayoutUrl === strippedCurrentUrl ) {
        return true;
      }

      return false;
    });

    if ( Object.keys( params ).length > 0 ) {
      this.props.navigation.setParams( params );
    }

    return {
      layoutAttribute,
    };
  }

  render() {
    const { layout } = this.state;

    return this.props.children( layout );
  }
}

const mapStateToProps = state => ({
  baseEntities: state.vertx.baseEntities,
  navigationReducer: state.navigation,
});

export default withNavigation( connect( mapStateToProps )( LayoutFetcher ));
