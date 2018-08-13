import React, { Component } from 'react';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import { location } from '../../../utils';
import { LayoutLoader, LayoutFetcher, KeycloakConsumer } from '../../components';
import Public from '../public';

class Generic extends Component {
  static propTypes = {
    keycloak: object,
  }

  render() {
    if ( !this.props.keycloak.isAuthenticated )
      return <Public {...this.props} />;

    const currentUrl = location.getBasePath();

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
