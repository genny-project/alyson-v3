import React, { Component, isValidElement } from 'react';
import { object, node, string, func, bool } from 'prop-types';
import { Formik } from 'formik';
import { isArray } from '../../../../utils';
import { Box, Recursive } from '../../index';

class FormGenericBody extends Component {
  static defaultProps = {
    submitOnEnterPress: true,
    wrapperProps: {},
  }

  static propTypes = {
    children: node,
    testID: string,
    validation: object,
    onSubmit: func,
    submitOnEnterPress: bool,
    wrapperProps: object,
  }

  doValidate = ( values ) => {
    const { validation } = this.props;

    const errors = {};

    if ( !validation ) return errors;

    Object.keys( validation ).forEach( x => {
      const valObject = validation[x];
      const value = values[x];

      if ( valObject.isRequired !== true ) return;

      if ( !value ) {
        errors[x] = 'Required';
      } else if ( !new RegExp( valObject.regex ).test( String( value ))) {
        errors[x] = valObject.warning;
      }
    });

    return errors;
  }

  handleKeyPress = () => ( e ) => {
    const key = e.key;

    switch ( key ) {
      case 'Enter':
        if ( this.props.onSubmit && this.props.submitOnEnterPress ) this.props.onSubmit();
        break;
      default:
        return null;
    }
  };

  render() {
    const { children, testID, onSubmit, wrapperProps } = this.props;

    return (
      <Formik
        validate={this.doValidate}
        onSubmit={onSubmit}
        testID={testID}
      >
        {( props ) => {
          return (
            <Box
              {...wrapperProps}
            >
              {isArray( children )
                ? children.map(( child, i ) => {
                  return isValidElement( child )
                    ? (
                      React.cloneElement( child, {
                        ...child.props,
                        context: {
                          ...child.context,
                          formProps: props,
                        },
                      })
                    )
                    : (
                      <Recursive
                        key={i} // eslint-disable-line react/no-array-index-key
                        {...child}
                        context={{
                          formProps: props,
                        }}
                      />
                    );
                })
                : (
                  <Recursive
                    {...children}
                    context={{
                      formProps: props,
                    }}
                  />
                )}
            </Box>
          );
        }}
      </Formik>
    );
  }
}

export default FormGenericBody;
