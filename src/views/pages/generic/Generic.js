import React, { Component } from 'react';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import { location } from '../../../utils';
import { LayoutLoader, LayoutFetcher, Redirect, KeycloakConsumer } from '../../components';

class Generic extends Component {
  static propTypes = {
    keycloak: object,
  }

  render() {
    const currentUrl = location.getBasePath();

    if ( !this.props.keycloak.isAuthenticated )
      return <Redirect to={`auth?redirectURL=${currentUrl}`} />;

    return (
      <LayoutFetcher currentUrl={currentUrl}>
        {layout => (
          <LayoutLoader
            layout={layout}
          />
        )}
      </LayoutFetcher>
    );
  }
}

export { Generic };

const mapStateToProps = state => ({
  navigation: state.navigation,
});

export default connect( mapStateToProps )(
  props => (
    <KeycloakConsumer>
      {keycloak => (
        <Generic
          {...props}
          keycloak={keycloak}
        />
      )}
    </KeycloakConsumer>
  )
);
