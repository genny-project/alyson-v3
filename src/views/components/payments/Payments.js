import React, { Component, cloneElement } from 'react';
import { WebView } from 'react-native';
import { node, object, string } from 'prop-types';
import { Formik } from 'formik';
import { Box, Button, Heading, KeyboardAwareScrollView } from '../../components';

class Payments extends Component {
  static propTypes = {
    children: node,
    initialValues: object,
    title: string,
  }

  handleMessage = event => {
    console.warn( event.nativeEvent.data );
  }

  handleSubmit = ( values, form ) => {
    const { setSubmitting } = form;

    setSubmitting( true );
  }

  render() {
    const { children, initialValues, title } = this.props;

    return (
      <KeyboardAwareScrollView>
        <Box
          height="100%"
          width="100%"
          flex={1}
          flexDirection="column"
          padding={20}
        >
          <Formik
            initialValues={initialValues}
            onSubmit={this.handleSubmit}
          >
            {({
              values,
              errors,
              isValid,
              isSubmitting,
              handleSubmit,
              setFieldTouched,
              setFieldValue,
            }) => (
              <Box
                flexDirection="column"
              >
                <Box
                  marginY={20}
                  justifyContent="center"
                >
                  <Heading
                    align="center"
                    size="lg"
                  >
                    {title}
                  </Heading>
                </Box>

                {React.Children.map( children, child => (
                  cloneElement( child, {
                    value: values && values[child.props.name],
                    error: errors && errors[child.props.name],
                    onChangeValue: value => {
                      setFieldValue( child.props.name, value );
                      setFieldTouched( child.props.name, true );
                    },
                  })
                ))}

                <Button
                  disabled={!isValid || isSubmitting}
                  color="green"
                  onPress={handleSubmit}
                  showSpinnerOnClick
                >
                  Submit
                </Button>
              </Box>
            )}
          </Formik>

          <WebView
            height={0}
            width={0}
            onMessage={this.handleMessage}
            source={require( './_payments.html' )}
          />
        </Box>
      </KeyboardAwareScrollView>
    );
  }
}

export default Payments;
