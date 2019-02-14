import React, { Component } from 'react';
import { bool, object, string, func } from 'prop-types';
import { Box, Touchable, Text } from '../../../index';

class InputTagSuggestion extends Component {
  static propTypes = {
    renderProp: object,
    item: object,
    itemString: string,
    isSelected: bool,
    isHighlighted: bool,
    touchableProps: object,
    getItemProps: func,
    allowMultipleSelection: bool,
    functions: object,
  }

  render() {
    const {
      item,
      itemString,
      isSelected,
      isHighlighted,
      allowMultipleSelection,
      functions,
      getItemProps,
    } = this.props;

    return (
      <Touchable
        {...getItemProps({
          item,
          withFeedback: true,
          onPress: () => {
            if ( allowMultipleSelection ) {
              functions.addItemToPreSelection( item );
            }
            else {
              functions.selectItem( item, );
              functions.clearSelection();
              functions.handleToggleMenu();
            }
          },
        })}
      >
        <Box
          padding={15}
          borderBottomWidth={1}
          borderColor="#DDD"
          borderStyle="solid"
          alignItems="center"
        >
          <Text
            color={isHighlighted ? 'black' : 'gray'}
            fontWeight={isSelected ? 'bold' : 'normal'}
          >
            {itemString}
          </Text>
        </Box>
      </Touchable>
    );
  }
}

export default InputTagSuggestion;
