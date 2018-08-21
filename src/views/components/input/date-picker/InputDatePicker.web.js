/**
 * Adapted from https://codesandbox.io/s/j47zv28xkw
 */

import React, { Component } from 'react';
import { string, func, oneOfType, object } from 'prop-types';
import Downshift from 'downshift';
import Kalendaryo from 'kalendaryo';
import range from 'lodash.range';
import { format, isSameMonth, isToday, setMonth, setYear, getMonth, getYear } from 'date-fns';
import { Input, Box, Text, Touchable, Icon } from '../../index';

const NUMBER_OF_DOB_YEARS = 125;

const currentYear = new Date().getFullYear();
const daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const years = range( NUMBER_OF_DOB_YEARS ).map( year => currentYear - year );

class InputDatePicker extends Component {
  static defaultProps = {
    displayFormat: 'MMMM Do, YYYY',
    calendarHeaderColor: 'crimson',
    calendarHeaderTextColor: 'white',
  }

  static propTypes = {
    displayFormat: string,
    calendarHeaderColor: string,
    calendarHeaderTextColor: string,
    onChangeValue: func,
    value: oneOfType( [string, object] ),
  }

  state = {
    isCalendarOpen: false,
  }

  handleCalendarToggle = () => {
    this.setState( state => ({ isCalendarOpen: !state.isCalendarOpen }));
  }

  handleChange = value => {
    const date = format( value );

    if ( this.props.onChangeValue )
      this.props.onChangeValue( date );
  }

  render() {
    const {
      displayFormat,
      calendarHeaderColor,
      calendarHeaderTextColor,
      value,
      ...restProps
    } = this.props;

    const { isCalendarOpen } = this.state;

    return (
      <Downshift
        defaultInputValue={value}
        onChange={this.handleChange}
        itemToString={date => date ? format( date, displayFormat ) : ''}
        isOpen={isCalendarOpen}
      >
        {({
          getInputProps,
          getItemProps,
          getRootProps,
          isOpen,
          selectedItem,
          inputValue,
          selectItem,
        }) => (
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
                              items={months}
                              value={months[getMonth( date )]}
                              onChangeValue={month => {
                                const monthIndex = months.findIndex( m => m === month );
                                const newDate = setMonth( date, monthIndex );

                                setDate( newDate );
                              }}
                              style={{
                                color: '#000',
                                backgroundColor: '#FFF',
                                padding: 5,
                                borderRadius: 10,
                                borderWidth: 0,
                                textAlign: 'center',
                                cursor: 'pointer',
                              }}
                            />
                          </Box>

                          <Box>
                            <Input
                              type="dropdown"
                              items={years}
                              value={years[getYear( date )]}
                              onChangeValue={year => {
                                const newDate = setYear( date, year );

                                setDate( newDate );
                              }}
                              style={{
                                color: '#000',
                                backgroundColor: '#FFF',
                                padding: 5,
                                borderRadius: 10,
                                borderWidth: 0,
                                textAlign: 'center',
                                cursor: 'pointer',
                              }}
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
                                  key={day.label}
                                  {...getItemProps({
                                    item: day.dateValue,
                                    disabled: isDisabled( day.dateValue ),
                                    style: {
                                      width: 'calc(100% / 7)',
                                      paddingVertical: 15,
                                      paddingHorizontal: 10,
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
                                    },
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
        )}
      </Downshift>
    );
  }
}

export default InputDatePicker;
