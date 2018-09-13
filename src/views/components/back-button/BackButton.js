import React, { Component } from 'react';
import { connect } from 'react-redux';
import { func, object } from 'prop-types';
import { NavigationActions, withNavigation } from 'react-navigation';
import { withKeycloak } from '../keycloak';

import { Icon, Touchable }  from '../../components';

class BackButton extends Component {
  static propTypes = {
    dispatch: func,
    keycloak: object,
    stackNavigation: object,
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
