import React, { Component } from 'react';
import { string, bool, func } from 'prop-types';
import { DatePickerAndroid, TimePickerAndroid } from 'react-native';
import moment from 'moment';
import { Box, Text, Touchable } from '../../../components';

class DatePicker extends Component {
  static defaultProps = {
    // value: '',
    // minuteInterval: 10,
    date: true,
    // defaultDateTimeFormat: 'hh:mm a Do MMM YYYY',
    defaultTimeFormat: 'hh:mm a',
    defaultDateFormat: 'DD MMM YYYY',
  }

  static propTypes = {
    // value: string,
    maximumDate: string,
    minimumDate: string,
    // minuteInterval: number,
    date: bool,
    time: bool,
    onChangeValue: func,
    // defaultDateTimeFormat: string,
    defaultTimeFormat: string,
    defaultDateFormat: string,
    // format: string,
    // onBlur: func,
  }

  constructor( props ) {
    super( props );
    this.state = {
      year: null,
      month: null,
      day: null,
      hour: null,
      minute: null,
      dateValue: null,
      timeValue: null,
    };
  }

  handleTimePickerOpen = async () => {
    const { action, hour, minute } = await TimePickerAndroid.open();

    if ( action !== TimePickerAndroid.dismissedAction )
      this.setState({ hour, minute }, this.handleChange );
  }

  handleDatePickerOpen = async () => {
    const { minimumDate, maximumDate } = this.props;

    const { action, year, month, day } = await DatePickerAndroid.open({
      minDate: minimumDate,
      maxDate: maximumDate,
      mode: 'spinner',
    });

    if ( action !== DatePickerAndroid.dismissedAction )
      this.setState({ year, month, day }, this.handleChange );
  }

  handleChange() {
    const { year, month, day, hour, minute } = this.state;
    const { time, date } = this.props;

    if (
      ( date && year && month && day && time && hour && minute ) ||
      ( date && year && month && day && !time ) ||
      ( time && hour && minute && !date )
    ) {
      const momentValue = moment( this.state );

      const formatted =
        ( time && date ) ? momentValue.format()
        : date ? momentValue.format( 'YYYY-MM-DD' )
        : time ? momentValue.format( 'HH:mm' )
        : '';

      this.props.onChangeValue( formatted );
    }
  }

  render() {
    const {
      date,
      time,
      // format,
      defaultTimeFormat,
      defaultDateFormat,
      // defaultDateTimeFormat,
    } = this.props;

    const { year, month, day, hour, minute } = this.state;

    const dateMoment = year && month && day && moment({ year, month, day });

    const timeMoment = hour && minute && moment({ hour, minute });

    const dateDisplayValue = dateMoment && dateMoment.isValid()
      ? dateMoment.format( defaultDateFormat )
      : null;

    const timeDisplayValue = timeMoment && timeMoment.isValid()
      ? timeMoment.format( defaultTimeFormat )
      : null;

    return (
      <Box
        paddingX={10}
      >
        {(
          date ? (
            <Touchable
              withFeedback
              onPress={this.handleDatePickerOpen}
              style={{
                width: '100%',
              }}
            >

              <Text
                text={dateDisplayValue || 'Date'}
              />

            </Touchable>
          ) : null
        )}

        {(
          time ? (
            <Touchable
              withFeedback
              onPress={this.handleTimePickerOpen}
              style={{
                position: 'absolute',
                right: 0,
              }}
            >

              <Text
                text={timeDisplayValue || 'Time'}
              />

            </Touchable>
          ) : null
        )}

      </Box>
    );
  }
}

export default DatePicker;
