import { Component } from 'react';
import { withNavigation, NavigationActions } from 'react-navigation';
import { string, object, bool } from 'prop-types';
import { routes } from '../../../config';
import { store } from '../../../redux';
import { navigator } from '../../../utils';

class Redirect extends Component {
  static defaultProps = {
    useAppNavigator: true,
  }

  static propTypes = {
    to: string.isRequired,
    appTo: string, // temp for main navigator second navigation action
    navigation: object,
    replace: bool,
    useAppNavigator: bool,
    useMainNavigator: bool,
    useTopLevelNavigator: bool,
    params: object,
  }

  componentDidMount() {
    const {
      navigation,
      to,
      replace,
      useAppNavigator,
      useTopLevelNavigator,
      useMainNavigator,
      params,
      appTo,
    } = this.props;

    const newPath = to.includes( '?' )
      ? to.split( '?' )[0]
      : to;

    const action = replace ? 'replace' : 'navigate';

    if (
      useMainNavigator ||
      useTopLevelNavigator
    ) {
      if ( appTo ) {
        store.dispatch(
          NavigationActions[action]({
            routeName: routes[appTo] ? appTo : 'generic',
            params: {
              ...params,
              layout: appTo,
            },
          }),
        );
      }

      navigator.navigate({
        useMainNavigator,
        useTopLevelNavigator,
        routeName: to,
      });
    }
    else if ( useAppNavigator ) {
      store.dispatch(
        NavigationActions[action]({
          routeName: (
            appTo ? (
              routes[appTo] ? appTo : 'generic'
            ) : (
              routes[newPath] ? newPath : 'generic'
            )
          ),
          params: {
            ...params,
            layout: newPath,
          },
        }),
      );
    }
    else {
      navigation[action]({
        routeName: (
          routes[newPath] ||
            newPath === 'app' ||
            newPath === 'auth'
        )
          ? newPath
          : 'generic',
        params: {
          ...params,
          layout: newPath,
        },
        key: newPath,
      });
    }
  }

  render() {
    return null;
  }
}

export default withNavigation( Redirect );
