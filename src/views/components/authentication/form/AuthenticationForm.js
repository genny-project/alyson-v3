import React, { Component } from 'react';
import { object, node, oneOf, string } from 'prop-types';
import { location } from '../../../../utils';
import { withKeycloak, Redirect } from '../../index';
import FormGenericBody from '../../form-generic/body';

class AuthenticationForm extends Component {
  static defaultProps = {
    testID: 'authentication-form',
  }

  static propTypes = {
    keycloak: object,
    children: node,
    type: oneOf(
      ['register', 'login']
    ),
    testID: string,
    validation: object,
  }

  state = {
    redirectUri: null,
  }

  componentDidMount() {
    this.setRedirectUri();
  }

  setRedirectUri() {
    const { redirectUri } = location.getQueryParams();

    if (
      redirectUri &&
      redirectUri !== 'login' &&
      redirectUri !== 'register'
    ) {
      this.setState({ redirectUri });
    }
  }

  handleSubmit = async ( values, form ) => {
    const { setSubmitting, setStatus } = form;
    const { keycloak, type } = this.props;

    setSubmitting( true );
    setStatus( null );

    try {
      if ( type === 'login' ) {
        await keycloak.doLoginWithApi( values );
      }
      else if ( type === 'register' ) {
        await keycloak.doRegisterWithApi( values );
      }
      else {
        console.error( 'Unable to submit authentication form - invalid type set', { type });

        setStatus( 'Invalid form type set' );
      }
    }
    catch ( error ) {
      setStatus( error.message || error );
    }
    finally {
      setSubmitting( false );
    }
  }

  render() {
    const { children, keycloak, testID, validation, ...restProps } = this.props;

    if ( keycloak.isAuthenticated ) {
      const { redirectUri } = this.state;

      return (
        <Redirect
          to={redirectUri || 'app'}
          useMainNavigator
          appTo="home"
        />
      );
    }

    return (
      <FormGenericBody
        {...restProps}
        testID={testID}
        validation={validation}
        onSubmit={this.handleSubmit}
      >
        {children}
      </FormGenericBody>
    );
  }
}

export default withKeycloak( AuthenticationForm );
