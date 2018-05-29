import React from 'react';
import { string } from 'prop-types';
import InputAddress from './address';
import InputAutocomplete from './autocomplete';
import CheckBox from './checkbox';
import DatePicker from './datepicker';
import InputFile from './file';
import InputScroll from './scroll';
import InputRating from './rating';
import InputText from './text';
import Switch from './switch';
import InputDropdown from './dropdown';
import Passcode from './passcode';
import { Text } from '../index';

const Input = props => {
  const { type } = props;

  switch ( type ) {
    case 'text':
    case 'abn number':
    case 'acn number':
      return <InputText {...props} />;

    case 'email':
      return <InputText icon="mail" {...props} />;

    case 'mobile':
      return <InputText icon="phone-iphone" keyboardType="numeric" {...props} />;

    case 'landline':
      return <InputText icon="call" keyboardType="numeric" {...props} />;

    case 'java.lang.boolean':
    case 'switch':
      return <Switch {...props} />;

    case 'termsandconditions':
    case 'scroll':
      return <InputScroll {...props} />;

    case 'rating':
      return <InputRating {...props} />;

    case 'autocomplete':
      return <InputAutocomplete {...props} />;

    case 'address':
      return <InputAddress {...props} />;

    case 'dropdown':
      return <InputDropdown {...props} />;

    case 'checkbox':
      return <CheckBox {...props} />;

    case 'radio':
      return <CheckBox {...props} radio />;

    case 'upload':
    case 'file':
      return <InputFile {...props} />;

    case 'image':
      return <InputFile {...props} imageOnly />;

    case 'date':
    case 'java.time.localdate':
      return <DatePicker {...props} date />;

    case 'datetime':
      return <DatePicker {...props} date time />;

    case 'mobileverification':
      return <Passcode {...props} />;

    default:
      return (
        <Text>
          Invalid type `
          {type}
          ` specified in Input
        </Text>
      );
  }
};

Input.propTypes = {
  type: string.isRequired,
};

export default Input;
