import React, { Component } from 'react';
import { bool, object, string } from 'prop-types';
import { Box, Touchable, Text } from '../../../index';

class InputTagSuggestion extends Component {
  static propTypes = {
    item: object,
    itemString: string,
    isSelected: bool,
    isHighlighted: bool,
    allowMultipleSelection: bool,
    functions: object,
    testID: string,
  }

  render() {
    const {
      item,
      itemString,
      isSelected,
      isHighlighted,
      allowMultipleSelection,
      functions,
      testID,
    } = this.props;

    return (
      <Touchable
        withFeedback
        onPress={() => {
          if ( allowMultipleSelection ) {
            functions.addItemToPreSelection( item, functions.selectMultipleItems );
          }
          else {
            functions.selectItem( item, );
            functions.clearSelection();
            functions.handleToggleMenu();
          }
        }}
        testID={`input-tag-option ${testID}`}
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
