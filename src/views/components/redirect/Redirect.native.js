import { Component } from 'react';
import { withNavigation, NavigationActions } from 'react-navigation';
import { string, object, bool } from 'prop-types';
import { routes } from '../../../config';
import { store } from '../../../redux';

class Redirect extends Component {
  static defaultProps = {
    useAppNavigator: true,
  }

  static propTypes = {
    to: string.isRequired,
    navigation: object,
    replace: bool,
    useAppNavigator: bool,
    params: object,
  }

  componentDidMount() {
    const { navigation, to, replace, useAppNavigator, params } = this.props;

    const newPath = to.includes( '?' )
      ? to.split( '?' )[0]
      : to;

    const action = replace ? 'replace' : 'navigate';

    if ( useAppNavigator ) {
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
      navigation[action]({
        routeName: routes[newPath] ? newPath : 'generic',
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
