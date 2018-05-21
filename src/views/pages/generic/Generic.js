import React, { Component } from 'react';
import { Platform } from 'react-native';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import { location } from '../../../utils';
import { LayoutLoader, Redirect, KeycloakConsumer } from '../../components';
/* eslint-disable */

class Generic extends Component {
  static propTypes = {
    navigation: object,
    baseEntities: object,
  }

  render() {
    if ( !this.props.keycloak.isAuthenticated )
      return <Redirect to="auth" />;

    const currentUrl = Platform.OS === 'web'
      ? location.getBasePath()
      : `/${this.props.navigation.state.params.layout}`;

    const { attributes, data } = this.props.baseEntities;

    const layoutAttribute = Object.keys( attributes ).find( attribute => {
      if ( attribute.startsWith( 'LAY' )) {
        const layoutUrl = attributes[attribute].PRI_LAYOUT_URI.valueString;

        if (
          layoutUrl === currentUrl ||
          (
            layoutUrl.endsWith( '/' ) &&
            layoutUrl.substr( 0, layoutUrl.length - 1 ) === currentUrl
          )
        ) {
          return true;
        }
      }

      return false;
    });

    const layout = (
      attributes[layoutAttribute] != null &&
      attributes[layoutAttribute].PRI_LAYOUT_DATA &&
      attributes[layoutAttribute].PRI_LAYOUT_DATA.valueString
    );

    let parsed = null;

    try {
      parsed = JSON.parse( layout );
    }
    catch ( error ) {
      console.warn( 'Unable to parse layout', layout );
    }

    return (
      <LayoutLoader
        layout={parsed}
      />
    );
  }
}

export { Generic };

const mapStateToProps = state => ({
  baseEntities: state.vertx.baseEntities,
});

export default connect( mapStateToProps )(
  props => (
    <KeycloakConsumer>
      {keycloak => <Generic {...props} keycloak={keycloak} />}
    </KeycloakConsumer>
  )
);
