import React, { Component } from 'react';
import { string, func, number, oneOf } from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import moment from 'moment';

import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

import { Box, Input } from '../../../components';

class DatePicker extends Component {  
  static defaultProps = {
    minuteInterval: 10,
    type: 'datetime',
  }

  static propTypes = {
    onChangeValue: func,
    maximumDate: string,
    minimumDate: string,
    minuteInterval: number,
    type: oneOf(
      ['date', 'time', 'datetime']
    ),
  }

  static getDerivedStateFromProps( nextProps, prevState ) {
    if ( 
      nextProps.value !== prevState.value && 
      nextProps.value != null
    ) {
      if ( moment( nextProps.value ).isValid()) {
        return { 
          value: moment( nextProps.value ),
          hour: moment( nextProps.value ).format( 'HH' ),
          minute: moment( nextProps.value ).format( 'mm' ),
        };
      }

      return { 
        value: moment(),
        hour: moment().format( 'HH' ),
        minute: moment().format( 'mm' ),
      };
    }

    return null;
  }

  state = {
  };
  
  handleDayChange = ( value ) => {
    const newValue = moment( value ).hour( this.state.hour ).minute( this.state.minute ).format();

    if ( this.props.onChangeValue ) {
      this.props.onChangeValue( newValue );
    }
  }

  handleTimeChange = ( value ) => {
    const newValue = value.format();

    if ( this.props.onChangeValue ) {
      this.props.onChangeValue( newValue );
    }
  }

  focus = () => {
    this.input.focus();
  }

  render() {
    const {
      type,
      minuteInterval,
      minimumDate,
      maximumDate,
    } = this.props;

    // state = {
    // };

    return (
      <Box
        flexDirection="row"
      >
        {
          type &&
          type.includes( 'date' )
            ? (
              <DayPickerInput
                onDayChange={this.handleDayChange}
                component={MyInput}
                style={{ flexGrow: 1 }}
                fromMonth={minimumDate}
                toMonth={maximumDate}
              /> 
            )
            : null
        }
        {
          type &&
          type.includes( 'time' )
            ? (
              <TimePicker
                showSecond={false}
                value={this.state.value}
                className="xxx"
                minuteStep={minuteInterval}
                onChange={this.handleTimeChange}
                format="h:mm a"
                use12Hours
                // inputReadOnly
                style={{ flexGrow: 1 }}
              />
            )
            : null
        }
      </Box>
    );
  }
}

/* eslint-disable */
class MyInput extends Component {

  static defaultProps = {
    value: '',
  }

  static propTypes = {
    value: string,
  }

  static getDerivedStateFromProps( nextProps, prevState ) {
    if ( 
      nextProps.value !== prevState.value && 
      nextProps.value != null
    ) {
      if ( moment( nextProps.value ).isValid()) {
        return { value: moment( nextProps.value ) };
      }

      return { value: moment() };
    }

    return null;
  }
  
  state = {
    value: null,
  }

  focus() {
    this.input.focus();
  }

  render() {
    return (
      <Input
        {...this.props}
        forwardedRef={el => {
          this.input = el;
        }}
        type="text"
        value={this.state.value.format('YYYY-MM-DD')}
      />
    );
  }
}

export default DatePicker;