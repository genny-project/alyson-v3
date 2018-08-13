import React, { Component } from 'react';
import { object, node } from 'prop-types';
import { Formik } from 'formik';
import { withKeycloak, Redirect } from '../../index';

class LoginForm extends Component {
  static propTypes = {
    keycloak: object,
    children: node,
  }

  handleSubmit = async ( values, form ) => {
    const { setSubmitting, setStatus } = form;
    const { keycloak } = this.props;

    setSubmitting( true );

    try {
      await keycloak.doLoginWithApi({
        username: values.email,
        password: values.password,
      });
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

export default withKeycloak( LoginForm );
