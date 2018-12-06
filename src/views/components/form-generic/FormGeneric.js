import React, { } from 'react';
import { any, bool, string, object } from 'prop-types';
import { Bridge } from '../../../utils';
import FormGenericBody from './body';

// let ref = null;

const FormGeneric = ({
  children,
  testID,
  validation,
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
      // ref && ref.reset && ref.reset();
    }
  };

  const handleSubmit = onSubmitSendEvent ? sendEvent : null;

  return (
    <FormGenericBody
      {...restProps}
      // ref={box => ref = box}
      // accessibilityRole="role"
      testID={testID}
      validation={validation}
      onSubmit={handleSubmit}
    >
      {children}
    </FormGenericBody>
  );
};

FormGeneric.propTypes = {
  children: any,
  onSubmitSendEvent: bool,
  value: any,
  buttonCode: string,
  eventType: string,
  messageType: string,
  injectFormValuesIntoValue: object,
  resetFormOnSubmit: bool,
  testID: string,
  validation: object,
};

export default FormGeneric;
