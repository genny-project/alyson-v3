import React, { Component } from 'react';
import { node, object, func } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchKeycloakConfig } from '../../../redux/actions';
import { KeycloakProvider } from '../../components';
import AuthenticatedAppLoading from './loading';
import AuthenticatedAppError from './error';

class AuthenticatedApp extends Component {
  static propTypes = {
    children: node,
    keycloak: object,
    fetchKeycloakConfig: func,
  }

  componentDidMount() {
    this.props.fetchKeycloakConfig();
  }

  render() {
    const { children, keycloak } = this.props;

    if ( keycloak.fetching )
      return <AuthenticatedAppLoading />;

    if ( keycloak.error )
      return <AuthenticatedAppError error={JSON.stringify( keycloak.error )} />;

    if (
      keycloak.fetched &&
      !keycloak.data
    ) {
      return <AuthenticatedAppError error="Unable to find Keycloak settings." />;
    }

    return (
      <KeycloakProvider
        baseUrl={keycloak.data.url}
        realm={keycloak.data.realm}
        clientId={keycloak.data.clientId}
        clientSecret={keycloak.data.credentials.secret}
      >
        {children}
      </KeycloakProvider>
    );
  }
}

export { AuthenticatedApp };

const mapStateToProps = state => ({
  keycloak: state.keycloak,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ fetchKeycloakConfig }, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( AuthenticatedApp );
