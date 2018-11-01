import { Component } from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { object, func, string, bool } from 'prop-types';
import { removeStartingAndEndingSlashes, NavigationActions } from '../../../utils';
import { store } from '../../../redux';
import { setDialogParams } from '../../../redux/actions';
import { withKeycloak } from '../../components/keycloak';

class LayoutFetcher extends Component {
  static propTypes = {
    layouts: object,
    children: func.isRequired,
    currentUrl: string.isRequired,
    navigationReducer: object,
    keycloak: object,
    isDialog: bool,
    setDialogParams: func,
  }

  state = {
    layout: null,
  }

  componentDidMount() {
    this.getLayout();
  }

  shouldComponentUpdate( nextProps ) {
    if ( !this.state.layout )
      return true;

    if (
      this.props.keycloak.isAuthenticated &&
      nextProps.navigationReducer &&
      nextProps.navigationReducer.index != null &&
      nextProps.navigationReducer.routes
    ) {
      const { index, routes } = nextProps.navigationReducer;
      const strippedCurrentUrl = removeStartingAndEndingSlashes( this.props.currentUrl );
      const strippedLastRoute = removeStartingAndEndingSlashes( routes[index].params.layout );

      return strippedCurrentUrl === strippedLastRoute;
    }

    return true;
  }

  componentDidUpdate( prevProps ) {
    if ( prevProps.currentUrl !== this.props.currentUrl || !this.state.layout ) {
      this.getLayout();
    }
  }

  getLayout() {
    const { pages, dialogs } = this.props.layouts;
    const { currentUrl, navigationReducer, isDialog } = this.props;

    const layoutPool = isDialog ? dialogs : pages;
    const strippedCurrentUrl = removeStartingAndEndingSlashes( currentUrl );

    if ( layoutPool[strippedCurrentUrl] ) {
      this.setState({ layout: layoutPool[strippedCurrentUrl] });
    }
    else {
      const keys = Object.keys( layoutPool ).sort( this.handleSortPages );
      const fragments = strippedCurrentUrl.split( '/' );

      const found = keys.some( key => {
        const params = {};

        const splitKey = key.split( '/' ).map(( split, index ) => {
          if ( split.startsWith( ':' )) {
            params[split.slice( 1 )] = fragments[index];

            return fragments[index];
          }

          return split;
        });

        if ( splitKey.join( '/' ) === strippedCurrentUrl ) {
          if ( !isDialog ) {
            if ( Platform.OS === 'web' ) {
              store.dispatch(
                replace({
                  pathname: location.pathname,
                  state: {
                    ...location.state,
                    ...params,
                  },
                })
              );
            }
            else {
              const { key } = navigationReducer.routes[navigationReducer.index];

              store.dispatch(
                NavigationActions.setParams({ key, params })
              );
            }
          }
          else {
            this.props.setDialogParams({
              layoutName: strippedCurrentUrl,
              params,
            });
          }

          this.setState({ layout: layoutPool[key] });

          return true;
        }

        /* If we were unable to locate a new layout, and
         * there is currently a saved layout in state, clear
         * the old layout from the state. This typically fixes
         * when the currentUrl changes but the new layout for
         * the new currentUrl isn't the state just yet. */
        if ( !found && this.state.layout )
          this.setState({ layout: null });
      });
    }
  }

  /**
   * Sort the pages so that the routes which contain
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
  handleSortPages = ( pageA, pageB ) => {
    if ( pageA.includes( ':' ) && pageB.includes( ':' ))
      return 0;

    /* Put pageA after layoutB. */
    if ( pageA.includes( ':' )) return 1;

    /* Put routeB after layoutA. */
    if ( pageB.includes( ':' )) return -1;

    return 0;
  }

  render() {
    const { layout } = this.state;

    return this.props.children( layout );
  }
}

const mapStateToProps = state => ({
  layouts: state.vertx.layouts,
  navigationReducer: state.navigation,
});

export default connect( mapStateToProps, { setDialogParams })(
  withKeycloak( LayoutFetcher )
);
