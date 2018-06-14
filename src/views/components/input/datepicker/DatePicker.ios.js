import React, { Component } from 'react';
import { string, number, bool, func } from 'prop-types';
import { DatePickerIOS, Modal, SafeAreaView  } from 'react-native';
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
    if ( this.props.onChangeValue ) {
      const { time, date } = this.props;
      const momentValue = moment( value );

      const formatted =
        ( time && date ) ? momentValue.format()
        : date ? momentValue.format( 'YYYY-MM-DD' )
        : time ? momentValue.format( 'HH:mm' )
        : '';

      this.props.onChangeValue( formatted );
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
      flex: 1,
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
          transparent
          onDismiss={this.handleDismiss}
        >
          <SafeAreaView
            style={{
              flex: 1,
            }}
          >
            <Touchable
              onPress={this.handleClose}
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                height="100%"
                width="100%"
              />
            </Touchable>

            <Box
              height="40%"
              width="100%"
              position="absolute"
              bottom={0}
              left={0}
              backgroundColor="white"
              flexDirection="column"
            >
              <Box
                justifyContent="flex-end"
                alignItems="center"
                borderTopWidth={1}
                borderBottomWidth={1}
                borderStyle="solid"
                borderColor="grey"
                paddingX={5}
              >
                <Touchable
                  withFeedback
                  onPress={this.handleClose}
                >
                  <Box padding={10}>
                    <Text fontWeight="bold">
                      Done
                    </Text>
                  </Box>
                </Touchable>
              </Box>

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
