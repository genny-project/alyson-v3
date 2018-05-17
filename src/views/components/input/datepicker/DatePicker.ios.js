import React, { Component } from 'react';
import { string, number, oneOf, func } from 'prop-types';
import { DatePickerIOS } from 'react-native';
import moment from 'moment';
import { Box } from '../../../components';

class DatePicker extends Component {
  static defaultProps = {
    // value: '',
    minuteInterval: 10,
    type: 'date',
  }

  static propTypes = {
    // value: string,
    maximumDate: string,
    minimumDate: string,
    minuteInterval: number,
    type: oneOf(
      ['date', 'time', 'datetime']
    ),
    onChangeValue: func,
  }

  static getDerivedStateFromProps( nextProps, prevState ) {
    if (
      nextProps.value !== prevState.value &&
      nextProps.value != null
    ) {
      if ( moment( nextProps.value ).isValid()) {
        return { value: new Date( moment( nextProps.value ).format()) };
      }

      return { value: new Date( moment().format()) };
    }

    return null;
  }

  state = {
    value: new Date(),
  };

  handleChange = ( value ) => {
    if ( this.props.onChangeValue ) this.props.onChangeValue( value );
  }

  render() {
    const {
      maximumDate,
      minimumDate,
      minuteInterval,
      type,
    } = this.props;

    const { value } = this.state;

    const style = {
      height: '100%',
      width: '100%',
    };

    return (
      <Box
        justifyContent="center"
        alignItems="center"
        width="100%"
        flex={1}
      >
        <DatePickerIOS
          date={value}
          onDateChange={this.handleChange}
          style={style}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          minuteInterval={minuteInterval}
          mode={type}
        />
      </Box>
    );
  }
}

export default DatePicker;
