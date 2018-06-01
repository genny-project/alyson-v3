import React, { Component } from 'react';
import { string, number, bool, func } from 'prop-types';
import { DatePickerIOS, TouchableOpacity, Modal, SafeAreaView  } from 'react-native';
import moment from 'moment';
import { Text, Box, Input } from '../../../components';

class DatePicker extends Component {
  static defaultProps = {
    // value: '',
    minuteInterval: 10,
    date: true,
    defaultDateTimeFormat: 'hh:mm a Do MMM YYYY',
    defaultTimeFormat: 'hh:mm a',
    defaultDateFormat: 'DD MMM YYYY',
  }

  static propTypes = {
    // value: string,
    maximumDate: string,
    minimumDate: string,
    minuteInterval: number,
    date: bool,
    time: bool,
    onChangeValue: func,
    defaultDateTimeFormat: string,
    defaultTimeFormat: string,
    defaultDateFormat: string,
    format: string,
    onBlur: func,
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
    isOpen: false,
  };

  handleChange = ( value ) => {
    console.warn( moment( value ).format( 'YYYY-MM-DD' ));
    if ( this.props.onChangeValue ) {
      this.props.onChangeValue(
        moment( value ).format( 'YYYY-MM-DD' )
      );
    }
  }

  handleDismiss = () => {
    if ( this.props.onBlur )
      this.props.onBlur();
  }

  handleFocus = () => {
    this.setState({
      isOpen: true,
    });
  }

  handleClose = () => {
    this.setState({
      isOpen: false,
    });
  }

  render() {
    const {
      maximumDate,
      minimumDate,
      minuteInterval,
      date,
      time,
      format,
      defaultTimeFormat,
      defaultDateFormat,
      defaultDateTimeFormat,
      onBlur, // eslint-disable-line no-unused-vars
      ...restProps
    } = this.props;

    const {
      value,
      isOpen,
    } = this.state;

    const style = {
      height: '100%',
      width: '100%',
    };

    const type = `${date ? 'date' : ''}${time ? 'time' : ''}`;

    const displayFormat = format || (
      ( date && time ) ? defaultDateTimeFormat
      : ( date ) ? defaultDateFormat
      : ( time ) ? defaultTimeFormat
      : ''
    );

    const displayValue = moment( value ).format( displayFormat );

    return (
      <Box
        justifyContent="center"
        alignItems="center"
        width="100%"
      >
        <Input
          {...restProps}
          type="text"
          value={displayValue}
          enabled={false}
          onFocus={this.handleFocus}
        />

        <Modal
          visible={isOpen}
          animationType="slide"
          style={{
            backgroundColor: 'white',
          }}
          onDismiss={this.handleDismiss}
        >
          <SafeAreaView
            style={{
              flex: 1,
            }}
          >
            <Box
              width="100%"
              height="100%"
              flexDirection="column"
            >
              <TouchableOpacity
                onPress={this.handleClose}
              >
                <Box
                  alignItems="flex-start"
                  justifyContent="flex-end"
                  flex={0}
                  paddingX={30}
                  paddingY={20}
                  borderColor="grey"
                  borderStyle="solid"
                  borderBottomWidth={2}
                >
                  <Text
                    color="black"
                    size="md"
                  >
                    Done
                  </Text>
                </Box>
              </TouchableOpacity>
              <Box
                flex={1}
                alignItems="center"
                justifyContent="center"
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
            </Box>
          </SafeAreaView>
        </Modal>
      </Box>
    );
  }
}

export default DatePicker;
