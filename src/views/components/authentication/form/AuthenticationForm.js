
import { object, node, oneOf, string } from 'prop-types';
import React, { Component, Fragment } from 'react';
import { Platform } from 'react-native';
import { Formik } from 'formik';
import { location } from '../../../../utils';
import { withKeycloak, Redirect } from '../../index';

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
    const { children, keycloak, testID } = this.props;

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
      <Formik
        validate={this.doValidate}
        onSubmit={this.handleSubmit}
        validateOnBlur
        enableReinitialize
        testID={testID}
      >
        {({ handleSubmit }) => (
          Platform.OS === 'web'
            ? (
              <form onSubmit={handleSubmit}>
                {children}
              </form>
            )
            : (
              <Fragment>
                {children}
              </Fragment>
            )
        )}
      </Formik>
    );
  }
}

export default withKeycloak( AuthenticationForm );
