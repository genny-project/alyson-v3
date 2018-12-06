/* eslint-disable react/jsx-handler-names */
import React, { Component } from 'react';
import { bool, string, node, func } from 'prop-types';
import { Field } from 'formik';
import { Input, Box, Text } from '../../index';

class FormGenericInput extends Component {
  static defaultProps = {
    testID: 'form-generic-input',
    validation: '.*',
  }

  static propTypes = {
    children: node,
    disabled: bool,
    name: string,
    testID: string,
    validation: string,
    submitOnEnterPress: func,
  }

  // handleKeyPress = ( e ) => {
  //   const key = e.key;

  //   switch ( key ) {
  //     case 'Enter':
  //       if ( this.props.submitOnEnterPress ) this.props.submitOnEnterPress();
  //       break;
  //     default:
  //       return null;
  //   }
  // };

  render() {
    const { name, disabled, testID, ...restProps } = this.props;

    return (
      <Field
        name={name}
      >
        {({ form, field }) => {
          return (
            <Box
              flexDirection="column"
              flex={1}
            >
              {
                form.errors && form.errors[name]
                  ? (
                    <Text
                      text={form.errors[name]}
                      color="red"
                    />
                  )
                  : null
              }
              <Input
                {...restProps}
                name={name}
                disabled={disabled || form.isSubmitting}
                value={field.value}
                onSubmitEditing={form.submitForm}
                onChangeValue={value => {
                  form.setFieldTouched( name, true );
                  form.setFieldValue( name, value );
                }}
                testID={testID}
                // onKeyPress={this.handleKeyPress}
              />
            </Box>
          );
        }}
      </Field>
    );
  }
}

export default FormGenericInput;
