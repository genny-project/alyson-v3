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
    navigation: object,
    replace: bool,
    useAppNavigator: bool,
    useTopLevelNavigator: bool,
    params: object,
  }

  componentDidMount() {
    const { navigation, to, replace, useAppNavigator, useTopLevelNavigator, params } = this.props;

    const newPath = to.includes( '?' )
      ? to.split( '?' )[0]
      : to;

    const action = replace ? 'replace' : 'navigate';

    if ( useTopLevelNavigator ) {
      navigator.navigate({
        useAuthNavigator: true,
        routeName: to,
      });
    }
    else if (
      useAppNavigator &&
      newPath !== 'app' &&
      newPath !== 'auth'
    ) {
      store.dispatch(
        NavigationActions[action]({
          routeName: routes[newPath] ? newPath : 'generic',
          params: {
            ...params,
            layout: newPath,
          },
        }),
      );
    }
    else {
      console.warn( routes[newPath] ? newPath : 'generic' );
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
