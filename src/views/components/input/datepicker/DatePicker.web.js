import React, { Component } from 'react';
import { string, func, number, bool } from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import 'react-day-picker/lib/style.css';
import { Box, Input } from '../../../components';
import './DatePicker.css';

class DatePicker extends Component {
  static defaultProps = {
    minuteInterval: 10,
    format: 'YYYY-MM-DD',
  }

  static propTypes = {
    onChangeValue: func,
    maximumDate: string,
    minimumDate: string,
    minuteInterval: number,
    date: bool,
    time: bool,
    displayFormat: string,
    format: string,
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
    value: null,
    hour: null,
    minute: null,
  }

  handleDayChange = ( value ) => {
    const { format } = this.props;

    let newValue = moment( value ).format( format );

    if ( this.props.time ) {
      newValue =
        moment( value )
          .hour( this.state.hour )
          .minute( this.state.minute )
          .format( format );
    }

    if ( this.props.onChangeValue ) {
      this.props.onChangeValue( newValue );
    }
  }

  handleTimeChange = ( value ) => {
    const { format } = this.props;
    const newValue = value.format( format );

    if ( this.props.onChangeValue ) {
      this.props.onChangeValue( newValue );
    }
  }

  focus = () => {
    this.input.focus();
  }

  render() {
    const {
      minuteInterval,
      minimumDate,
      maximumDate,
      date,
      time,
      displayFormat,
    } = this.props;

    return (
      <Box
        flexDirection="row"
      >
        {date ? (
          <DayPickerInput
            onDayChange={this.handleDayChange}
            component={props => (
              <MyInput
                {...props}
                format={displayFormat}
                ref={input => this.input = input}
              />
            )}
            style={{ flexGrow: 1 }}
            fromMonth={minimumDate}
            toMonth={maximumDate}
          />
        ) : null}

        {time ? (
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
        ) : null}
      </Box>
    );
  }
}

/* eslint-disable react/no-multi-comp */
class MyInput extends Component {
  static defaultProps = {
    value: '',
    format: 'YYYY-MM-DD',
  }

  static propTypes = {
    value: string,
    format: string,
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
    value: moment(),
  }

  focus() {
    this.input.focus();
  }

  render() {
    const { value, format } = this.state;

    return (
      <Input
        {...this.props}
        forwardedRef={input => this.input = input}
        type="text"
        value={value.format( format )}
      />
    );
  }
}

export default DatePicker;
