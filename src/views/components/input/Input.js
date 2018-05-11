import React from 'react';
import { string } from 'prop-types';
import Text from '../text';
import InputText from './text';
import Switch from './switch';

const Input = props => {
  const { type } = props;

  switch ( type ) {
    case 'text':
      return <InputText {...props} />;
    case 'switch':
      return <Switch {...props} />;

    default:
      return <Text>Invalid type `{type}` specified in Input</Text>;
  }
};

Input.propTypes = {
  type: string,
};

export default Input;
