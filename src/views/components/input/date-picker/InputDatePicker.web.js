/**
 * Adapted from https://codesandbox.io/s/j47zv28xkw
 */

import React, { PureComponent } from 'react';
import { string, func, oneOfType, object } from 'prop-types';
import Downshift from 'downshift';
import Kalendaryo from 'kalendaryo';
import range from 'lodash.range';
import { format, isSameMonth, isToday, setMonth, setYear, getMonth, getYear } from 'date-fns';
import { getDeviceSize } from '../../../../utils';
import { Input, Box, Text, Touchable, Icon } from '../../index';

const NUMBER_OF_DOB_YEARS = 125;

const currentYear = new Date().getFullYear();
const daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const years = range( NUMBER_OF_DOB_YEARS ).map( year => currentYear + 2 - year );

class InputDatePicker extends PureComponent {
  static defaultProps = {
    displayFormat: 'MMMM Do, YYYY',
    calendarHeaderColor: 'crimson',
    calendarHeaderTextColor: 'white',
    placeholder: 'Please select a date...', // eslint-disable-line
  }

  static propTypes = {
    displayFormat: string,
    calendarHeaderColor: string,
    calendarHeaderTextColor: string,
    onChangeValue: func,
    value: oneOfType( [string, object] ),
    testID: string,
  }

  state = {
    isCalendarOpen: false,
  }

  componentDidMount() {
    this.setSelectedItem();
  }

  componentDidUpdate( prevProps ) {
    if (
      this.props.value != null &&
      prevProps.value !== this.props.value
    ) {
      this.setSelectedItem();
    }
  }

  setSelectedItem = () => {
    if ( this.props.value ) {
      this.setState({
        value: this.props.value,
      });
    }
  }

  handleCalendarToggle = () => {
    this.setState( state => ({ isCalendarOpen: !state.isCalendarOpen }));
  }

  handleChange = value => {
    this.setState({
      value: this.props.value,
    }, () => {
      const date = format( value );

      if ( this.props.onChangeValue )
        this.props.onChangeValue( date );
    });
  }

  render() {
    const {
      displayFormat,
      calendarHeaderColor,
      calendarHeaderTextColor,
      value,
      testID,
      ...restProps
    } = this.props;

    const { isCalendarOpen } = this.state;

    return (
      <Downshift
        defaultInputValue={value}
        onChange={this.handleChange}
        itemToString={date => {
          return date ? format( date, displayFormat ) : '';
        }}
        isOpen={isCalendarOpen}
        selectedItem={this.state.value}
      >
        {({
          getInputProps,
          getItemProps,
          getRootProps,
          isOpen,
          selectedItem,
          inputValue,
          selectItem,
        }) => {
          return (
            <Box
              {...getRootProps( undefined, { suppressRefError: true })}
            >
              <Box>
                {isOpen ? (
                  <Touchable
                    onPress={this.handleCalendarToggle}
                  >
                    <Box
                      position="fixed"
                      top={0}
                      left={0}
                      width="100%"
                      height="100%"
                    />
                  </Touchable>
                ) : null}
              </Box>

              <Box
                position="relative"
                width="100%"
              >
                <div
                  onClick={this.handleCalendarToggle}
                  style={{
                    width: '100%',
                  }}
                >
                  <Input
                    {...getInputProps({
                      ...restProps,
                      type: 'text',
                      editable: false,
                      value: inputValue,
                    })}
                    testID={`input-date-picker ${testID}`}
                  />
                </div>

                {isOpen ? (
                  <Kalendaryo
                    startCurrentDateAt={selectedItem}
                    selectedItem={selectedItem}
                    getItemProps={getItemProps}
                    calendarHeaderColor={calendarHeaderColor}
                    calendarHeaderTextColor={calendarHeaderTextColor}
                    selectItem={selectItem}
                    render={({
                      getFormattedDate,
                      getWeeksInMonth,
                      getDatePrevMonth,
                      getDateNextMonth,
                      setDate,
                      getItemProps,
                      selectedItem,
                      date,
                      calendarHeaderColor,
                      calendarHeaderTextColor,
                      selectItem,
                    }) => {
                      const weeksInCurrentMonth = getWeeksInMonth();
                      const isDisabled = dateValue => !isSameMonth( date, dateValue );
                      const isSelectedDay = date => (
                        selectedItem &&
                      getFormattedDate( selectedItem ) === getFormattedDate( date )
                      );

                      return (
                        <Box
                          flexDirection="column"
                          marginTop="0.5rem"
                          boxShadow="0 1px 5px #AEAEAE"
                          borderRadius={5}
                          overflow="hidden"
                          backgroundColor="#FFF"
                          position="absolute"
                          zIndex={20}
                          top="100%"
                          {...( getDeviceSize() === 'sm' ? { width: '100%' } : null )}
                          onPress={event => {
                            event.stopPropagation();
                          }}
                        >
                          <Box
                            justifyContent="space-between"
                            alignItems="center"
                            paddingX={10}
                            paddingY={15}
                            backgroundColor={calendarHeaderColor}
                            onPress={event => {
                              event.stopPropagation();
                            }}
                          >
                            <Touchable
                              withFeedback
                              onPress={event => {
                                event.stopPropagation();
                                setDate( getDatePrevMonth());
                              }}
                            >
                              <Icon
                                name="arrow-back"
                                color={calendarHeaderTextColor}
                              />
                            </Touchable>

                            <Box>
                              <Input
                                type="dropdown"
                                items={months.map(( m, index ) => (
                                  { value: m, label: m, weight: index }
                                ))}
                                value={months[getMonth( date )]}
                                sortByWeight
                                onChangeValue={month => {
                                  const monthIndex = months.findIndex( m => m === month );
                                  const newDate = setMonth( date, monthIndex );

                                  setDate( newDate );
                                }}
                                color="#000"
                                backgroundColor="#FFF"
                                padding={5}
                                borderRadius={10}
                                borderWidth={0}
                                textAlign="center"
                                cursor="pointer"
                                testID={`input-date-picker-month ${testID}`}
                              />
                            </Box>

                            <Box>
                              <Input
                                type="dropdown"
                                items={years.map(( y, index ) => (
                                  { value: y, label: y, weight: index }
                                ))}
                                value={years[years.findIndex( year => year === getYear( date ))]}
                                onChangeValue={year => {
                                  const newDate = setYear( date, year );

                                  setDate( newDate );
                                }}
                                color="#000"
                                backgroundColor="#FFF"
                                padding={5}
                                borderRadius={10}
                                borderWidth={0}
                                textAlign="center"
                                cursor="pointer"
                                testID={`input-date-picker-year ${testID}`}
                              />
                            </Box>

                            <Touchable
                              withFeedback
                              onPress={event => {
                                event.stopPropagation();
                                setDate( getDateNextMonth());
                              }}
                            >
                              <Icon
                                name="arrow-forward"
                                color={calendarHeaderTextColor}
                              />
                            </Touchable>
                          </Box>

                          <Box
                            flexDirection="column"
                            borderWidth={2}
                            borderColor="#efefef"
                            borderStyle="solid"
                          >
                            <Box
                              backgroundColor="#F8F8F8"
                            >
                              {daysOfTheWeek.map( day => (
                                <Box
                                  key={day}
                                  width="calc(100% / 7)"
                                  paddingX={10}
                                  paddingY={15}
                                >
                                  <Text>
                                    {day}
                                  </Text>
                                </Box>
                              ))}
                            </Box>

                            {weeksInCurrentMonth.map(( week, weekIndex ) => (
                              <Box
                                key={weekIndex} // eslint-disable-line react/no-array-index-key
                                borderTopWidth={1}
                                borderStyle="solid"
                                borderColor="#efefef"
                              >
                                {week.map(( day, dayIndex ) => (
                                  <Touchable
                                    testID={`input-date-picker-option input-date-picker-day ${testID}`}
                                    key={day.label}
                                    {...getItemProps({
                                      item: day.dateValue,
                                      disabled: isDisabled( day.dateValue ),
                                      width: 'calc(100% / 7)',
                                      paddingY: 15,
                                      paddingX: 10,
                                      backgroundColor: (
                                        isSelectedDay( day.dateValue )
                                          ? calendarHeaderColor
                                          : '#FFFFFF'
                                      ),
                                      ...dayIndex > 0 && {
                                        borderLeftWidth: 1,
                                        borderStyle: 'solid',
                                        borderColor: '#efefef',
                                      },
                                      ...isDisabled( day.dateValue ) && {
                                        cursor: 'not-allowed',
                                      },
                                      justifyContent: 'center',
                                      withFeedback: true,
                                      onPress: event => {
                                        if ( isDisabled( day.dateValue ))
                                          event.stopPropagation();
                                        else {
                                          selectItem( day.dateValue );
                                          this.handleCalendarToggle();
                                        }
                                      },
                                    })}
                                  >
                                    <Text
                                      align="center"
                                      color={(
                                      isSelectedDay( day.dateValue ) ? calendarHeaderTextColor
                                      : isDisabled( day.dateValue ) ? '#dedede'
                                      : isToday( day.dateValue ) ? 'crimson'
                                      : '#000000'
                                    )}
                                    >
                                      {day.label}
                                    </Text>
                                  </Touchable>
                                ))}
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      );
                    }}
                  />
                ) : null}
              </Box>
            </Box>
          );}}
      </Downshift>
    );
  }
}

export default InputDatePicker;
