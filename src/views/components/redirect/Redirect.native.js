import { Component } from 'react';
import { withNavigation } from 'react-navigation';
import { string, object, bool } from 'prop-types';

class Redirect extends Component {
  componentDidMount() {
    const { navigation, to, replace } = this.props;

    const newPath = to.includes( '?' ) ? to.split( '?' )[0] : to;

    if ( replace )
      navigation.replace( newPath );
    else
      navigation.navigate( newPath );
  }

  render() {
    return null;
  }
}

Redirect.propTypes = {
  to: string.isRequired,
  navigation: object,
  replace: bool,
};

export default withNavigation( Redirect );
