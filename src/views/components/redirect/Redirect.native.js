import { Component } from 'react';
import { withNavigation } from 'react-navigation';
import { string, object, bool } from 'prop-types';

class Redirect extends Component {
  componentDidMount() {
    const { navigation, to, replace } = this.props;

    if ( replace )
      navigation.replace( to );
    else
      navigation.navigate( to );
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
