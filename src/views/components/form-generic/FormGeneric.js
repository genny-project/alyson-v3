import React, { isValidElement, createElement } from 'react';
import { Platform } from 'react-native';
import { any, bool, string, object } from 'prop-types';
import { Formik } from 'formik';
import dlv from 'dlv';
import { isArray, isString, Bridge } from '../../../utils';
import { Recursive, Box } from '../index';

let ref = null;

const FormGeneric = ({
  children,
  context,
  onSubmitSendEvent,
  value,
  buttonCode,
  eventType = 'FORM_SUBMIT',
  messageType = 'BTN',
  injectFormValuesIntoValue,
  resetFormOnSubmit,
  ...restProps
}) => {
  const sendEvent = ( values, form ) => {
    const valueToSend = injectFormValuesIntoValue
      ? {
        ...value,
        ...Object.keys( injectFormValuesIntoValue ).reduce(( valueInjected, valueKey ) => {
          const formKey = injectFormValuesIntoValue[valueKey];

          valueInjected[valueKey] = values[formKey];

          return valueInjected;
        }, {}),
      }
      : value;

    const valueString = (
      valueToSend &&
      typeof valueToSend === 'string'
    )
      ? valueToSend
      : JSON.stringify( valueToSend );

    Bridge.sendEvent({
      event: messageType,
      eventType,
      sendWithToken: true,
      data: {
        code: buttonCode,
        value: valueString || null,
      },
    });

    if ( resetFormOnSubmit ) {
      form.resetForm();
      ref && ref.reset && ref.reset();
    }
  };

  const handleKeyPress = (  values, form ) => ( e ) => {
    const key = e.key;

    switch ( key ) {
      case 'Enter':
        sendEvent( values, form );
        break;
      default:
        return null;
    }
  };

  const handleSubmit = onSubmitSendEvent ? sendEvent : null;

  return (
    <Formik
      onSubmit={handleSubmit}
    >
      {formik => {
        const element = Platform.OS === 'web' ? 'form' : Box;

        return createElement( element, {
          ...restProps,
          ref: node => ref = node,
          onSubmit: formik.handleSubmit,
        }, (
            isValidElement( children ) ? children
            : isString( children ) ? children
            : isArray( children )
              ? children.map(( child, i ) => {
                if ( dlv( child, 'props.props.submitOnEnterPress' )) child.props.props.onKeyPress = handleKeyPress( formik.values, formik );

                return isValidElement( child )
                  ? child
                  : (
                    <Recursive
                      key={i} // eslint-disable-line react/no-array-index-key
                      {...child}
                      context={{
                        ...context,
                        ...formik,
                      }}
                    />
                  );
              })
              : (
                <Recursive
                  {...children}
                  context={{
                    ...context,
                    ...formik,
                  }}
                />
              )
          ));
      }}
    </Formik>
  );
};

FormGeneric.propTypes = {
  children: any,
  context: any,
  onSubmitSendEvent: bool,
  value: any,
  buttonCode: string,
  eventType: string,
  messageType: string,
  injectFormValuesIntoValue: object,
  resetFormOnSubmit: bool,
};

export default FormGeneric;
