import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { NavigationActions, withNavigation } from 'react-navigation';
import { withKeycloak } from '../keycloak';
import { any, array, string, object } from 'prop-types';

import { Icon, Box, Touchable }  from '../../components';

class BackButton extends Component {
  static defaultProps = {
  };

  static propTypes = {
  };

  state = {};

  handleClick = () => {
    const { dispatch, keycloak, stackNavigation } = this.props;

    if ( keycloak.isAuthenticated ) {
      dispatch(
        NavigationActions.back()
      );
    }
    else {
      stackNavigation.goBack();
    }
  }

  render() {
    return (
      <Touchable
        withFeedback
        onPress={this.handleClick}
      >
        <Icon
          name="chevron-left"
          color="black"
          size="xl"
        />
      </Touchable>
    );
  }
}

export { BackButton };

const mapStateToProps = state => ({
  navigationReducer: state.navigation,
});

export default (
  connect( mapStateToProps )(
    withNavigation(
      withKeycloak( BackButton )
    )
  )
);
