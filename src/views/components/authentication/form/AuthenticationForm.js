import React, { Component } from 'react';
import { object, node, oneOf } from 'prop-types';
import { Formik } from 'formik';
import { withKeycloak, Redirect } from '../../index';

class AuthenticationForm extends Component {
  static propTypes = {
    keycloak: object,
    children: node,
    type: oneOf(
      ['register', 'login']
    ),
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
    const { children, keycloak } = this.props;

    if ( keycloak.isAuthenticated ) {
      return (
        <Redirect
          to="app"
          removeRedirectURL
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
      >
        {() => children}
      </Formik>
    );
  }
}

export default withKeycloak( AuthenticationForm );
