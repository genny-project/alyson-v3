import React, { Component } from 'react';
import { string, object } from 'prop-types';
import { Text } from '../index';
import InputAddress from './address';
import InputAutocomplete from './autocomplete';
import CheckBox from './checkbox';
import InputDatePicker from './date-picker';
import InputFile from './file';
import InputScroll from './scroll';
import InputRating from './rating';
import InputText from './text';
import Switch from './switch';
import InputDropdown from './dropdown';
import Passcode from './passcode';
import InputRead from './read';
import InputCurrency from './currency';
import InputCreditCard from './credit-card';
import InputCheckbox from './checkbox-2';
import InputPayment from './payment';
import AudioRecord from './audio-record';
import SegmentedControl from './segmented-control';
import InputTag from './tag';
import Signature from './signature';
import RichTextEditor from './rich-text-editor';

class Input extends Component {
  static propTypes = {
    type: string.isRequired,
    typeOnlyProps: object,
    question: object,
  };

  blur() {
    if ( this.input && this.input.blur ) {
      this.input.blur();
    }
  }

  focus() {
    if ( this.input && this.input.focus ) {
      this.input.focus();
    }
  }

  render() {
    const { type, typeOnlyProps, ...restProps } = this.props;

    const inputProps = {
      ...restProps,
      ...(( typeOnlyProps && typeOnlyProps[type] ) || {}),
      type,
    };

    switch ( type ) {
      case 'text':
      case 'abn number':
      case 'acn number':
      case 'double':
        return (
          <InputText
            {...inputProps}
            ref={input => ( this.input = input )}
          />
        );

      case 'password':
        return (
          <InputText
            {...inputProps}
            type="text"
            secureTextEntry
            ref={input => ( this.input = input )}
          />
        );

      case 'email':
        return (
          <InputText
            keyboardType="email-address"
            {...inputProps}
            ref={input => ( this.input = input )}
          />
        );

      case 'textarea':
        return (
          <InputText
            multiline
            numberOfLines={3}
            height={100}
            {...inputProps}
            ref={input => ( this.input = input )}
          />
        );

      case 'number':
      case 'java.lang.integer':
      case 'java.lang.long':
      case 'java.lang.Long':
      case 'java.lang.Integer':
      case 'mobile':
      case 'landline':
        return (
          <InputText
            keyboardType="phone-pad"
            {...inputProps}
            ref={input => ( this.input = input )}
          />
        );

      case 'currency':
      case 'org.javamoney.moneta.money':
        return (
          <InputCurrency
            {...inputProps}
            ref={input => ( this.input = input )}
          />
        );

      case 'java.lang.boolean':
      case 'switch':
        return (
          <Switch
            {...inputProps}
            ref={input => ( this.input = input )}
          />
        );

      case 'read':
      case 'termsandconditions':
        return (
          <InputRead
            {...inputProps}
            ref={input => ( this.input = input )}
          />
        );

      case 'scroll':
        return (
          <InputScroll
            {...inputProps}
            ref={input => ( this.input = input )}
          />
        );

      case 'rating':
        return (
          <InputRating
            {...inputProps}
            ref={input => ( this.input = input )}
          />
        );

      case 'autocomplete':
        return (
          <InputAutocomplete
            {...inputProps}
            ref={input => ( this.input = input )}
          />
        );

      case 'address':
        return (
          <InputAddress
            {...inputProps}
            ref={input => ( this.input = input )}
          />
        );

      case 'dropdown':
        return (
          <InputDropdown
            {...inputProps}
            ref={input => ( this.input = input )}
          />
        );

      case 'checkbox':
        return (
          <CheckBox
            {...inputProps}
            ref={input => ( this.input = input )}
          />
        );

      case 'radio':
        return (
          <CheckBox
            {...inputProps}
            radio
            ref={input => ( this.input = input )}
          />
        );

      case 'file':
      case 'upload':
        return (
          <InputFile
            {...inputProps}
            ref={input => ( this.input = input )}
          />
        );

      case 'filemultiple':
      case 'uploadmultiple':
        return (
          <InputFile
            {...inputProps}
            multiple
            ref={input => ( this.input = input )}
          />
        );

      case 'image':
      case 'Image':
        return (
          <InputFile
            {...inputProps}
            imageOnly
            ref={input => ( this.input = input )}
          />
        );

      case 'imagemultiple':
      case 'Imagemultiple':
      case 'images':
        return (
          <InputFile
            {...inputProps}
            multiple
            imageOnly
            ref={input => ( this.input = input )}
          />
        );

      case 'date':
      case 'java.time.localdate':
        return (
          <InputDatePicker
            {...inputProps}
            date
            ref={input => ( this.input = input )}
          />
        );

      case 'datetime':
      case 'java.time.localdatetime':
        return (
          <InputDatePicker
            {...inputProps}
            date
            time
            ref={input => ( this.input = input )}
          />
        );

      case 'mobileverification':
        return (
          <Passcode
            {...inputProps}
            ref={input => ( this.input = input )}
          />
        );

      case 'codeverificationfive':
      case 'codeVerificationFive':
        return (
          <Passcode
            {...inputProps}
            numberOfInputs={5}
            keyboardType="default"
            ref={input => ( this.input = input )}
          />
        );

      case 'credit-card':
        return (
          <InputCreditCard
            {...inputProps}
            ref={input => ( this.input = input )}
          />
        );

      case 'checkboxmultiple':
        return (
          <InputCheckbox
            {...inputProps}
            ref={input => ( this.input = input )}
          />
        );

      case 'payment':
        return (
          <InputPayment
            {...inputProps}
            ref={input => ( this.input = input )}
          />
        );

      case 'audioRecord':
      case 'audiorecord':
        return (
          <AudioRecord
            {...inputProps}
            ref={input => ( this.input = input )}
          />
        );

      case 'segmentedcontrol':
        return (
          <SegmentedControl
            {...inputProps}
            ref={input => ( this.input = input )}
          />
        );

      case 'dropdownmultiple':
        return (
          <InputTag
            {...inputProps}
            allowMultipleSelection
            ref={input => ( this.input = input )}
          />
        );
      case 'tag':
        return (
          <InputTag
            {...inputProps}
            ref={input => ( this.input = input )}
          />
        );
      case 'signature':
        return <Signature {...this.props} />;

      case 'htmlarea':
      case 'rich-text-editor':
        return (
          <RichTextEditor
            {...inputProps}
            ref={input => ( this.input = input )}
          />
        );
      default:
        return (
          <Text>
            Invalid type `
            {type}
            ` specified in Input
          </Text>
        );
    }
  }
}

export default Input;
