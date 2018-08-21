/**
 * Adapted from https://codesandbox.io/s/j47zv28xkw
 */

import React from 'react';
import { string, func } from 'prop-types';
import Downshift from 'downshift';
import Kalendaryo from 'kalendaryo';
import { format, isSameMonth, isToday } from 'date-fns';
import { Input, Box, Text, Touchable, Icon } from '../../index';

const daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const InputDatePicker = ({
  displayFormat = 'MMMM Do, YYYY',
  calendarHeaderColor = 'crimson',
  calendarHeaderTextColor = 'white',
  onChangeValue,
  ...restProps
}) => (
  <Downshift
    onChange={value => console.warn({ value }) || onChangeValue( value )}
    itemToString={date => date ? format( date, displayFormat ) : ''}
  >
    {({
      getInputProps,
      getItemProps,
      getRootProps,
      toggleMenu,
      isOpen,
      selectedItem,
      inputValue,
      selectItem,
    }) => (
      <Box
        {...getRootProps( undefined, { suppressRefError: true })}
        position="relative"
      >
        <div
          onClick={toggleMenu}
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
              const currentDate = getFormattedDate( 'MMM YYYY' );
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
                >
                  <Box
                    justifyContent="space-between"
                    alignItems="center"
                    paddingX={10}
                    paddingY={15}
                    backgroundColor={calendarHeaderColor}
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
                      <Text
                        align="center"
                        color={calendarHeaderTextColor}
                      >
                        {currentDate}
                      </Text>
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

                                selectItem( day.dateValue );
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
    )}
  </Downshift>
);

InputDatePicker.propTypes = {
  displayFormat: string,
  calendarHeaderColor: string,
  calendarHeaderTextColor: string,
  onChangeValue: func,
};

export default InputDatePicker;
