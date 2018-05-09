import React, { Component, Fragment } from 'react';
import { Formik } from 'formik';
import { Input } from '../index';

class Form extends Component {
  render() {
    return (
      <Formik>
        {formik => ( // eslint-disable-line
          <Fragment>
            <Input
              type="text"
              placeholder="e.g. John"
              label="First name"
              icon="person"
              success
            />

            <Input
              type="text"
              placeholder="e.g. Smith"
              error
              icon="group"
            />
          </Fragment>
        )}
      </Formik>
    );
  }
}

export default Form;
