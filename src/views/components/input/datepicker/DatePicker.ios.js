import React, { Component } from 'react';
import { string, number, bool, func } from 'prop-types';
import { DatePickerIOS, TouchableOpacity, Modal, SafeAreaView  } from 'react-native';
import moment from 'moment';
import { Text, Box, Input, Touchable } from '../../../components';

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
    console.warn({ nextProps, prevState });

    if (
      nextProps.value != null &&
      nextProps.value !== prevState.value
    ) {
      if (
        nextProps.value instanceof Date &&
        isFinite( nextProps.value )
      ) {
        return { value: nextProps.value };
      }

      const parsedDate = new Date( nextProps.value );

      if ( parsedDate !== 'Invalid Date' ) {
        return { value: parsedDate };
      }
    }

    return null;
  }

  state = {
    value: null,
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

  handleOpen = () => {
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

    const momentValue = moment( value );
    const displayValue = momentValue.isValid()
      ? momentValue.format( displayFormat )
      : null;

    return (
      <Box
        justifyContent="center"
        alignItems="center"
        width="100%"
      >
        <Touchable
          withFeedback
          onPress={this.handleOpen}
          style={{
            width: '100%',
            position: 'relative',
          }}
        >
          <Input
            {...restProps}
            type="text"
            value={displayValue}
            placeholder="Select a date..."
            editable={false}
            prefixIcon="event"
            icon="expand-more"
          />

          <Box
            width="100%"
            height="100%"
            position="absolute"
            top={0}
            left={0}
          />
        </Touchable>

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
                  date={value || new Date()}
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
