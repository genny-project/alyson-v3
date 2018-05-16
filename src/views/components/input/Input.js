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
import Text from '../text';

const Input = props => {
  const { type } = props;

  switch ( type ) {
    case 'text':
      return <InputText {...props} />;
    case 'switch':
      return <Switch {...props} />;
    case 'scroll':
      return <InputScroll {...props} />;
    case 'rating':
      return <InputRating {...props} />;
    case 'autocomplete':
      return <InputAutocomplete {...props} />;
    case 'address':
      return <InputAddress {...props} />;
    case 'checkbox':
      return <CheckBox {...props} />;
    case 'radio':
      return <CheckBox {...props} radio />;
    case 'file':
      return <InputFile {...props} />;
    case 'date':
      return <DatePicker {...props} />;
    case 'datetime':
      return <DatePicker {...props} />;
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
  type: string,
};

export default Input;
