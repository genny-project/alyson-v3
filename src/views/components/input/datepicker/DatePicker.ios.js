import React, { Component } from 'react';
import { string, number, oneOf, func } from 'prop-types';
import { DatePickerIOS, TouchableOpacity, Modal, SafeAreaView  } from 'react-native';
import moment from 'moment';
import { Text, Box, Input } from '../../../components';

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
    isOpen: false,
  };

  handleChange = ( value ) => {
    if ( this.props.onChangeValue ) this.props.onChangeValue( value );
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
      type,
    } = this.props;

    const { 
      value,
      isOpen,
    } = this.state;

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
        <Input
          type="text"
          value={value}
          enabled={false}
          onFocus={this.handleFocus}
        />

        <Modal
          visible={isOpen}
          animationType="slide"
          style={{
            backgroundColor: 'white',
          }}
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
                    color="grey"
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
