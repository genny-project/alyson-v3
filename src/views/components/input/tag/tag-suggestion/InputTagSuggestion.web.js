import React, { Component } from 'react';
import { bool, object, string } from 'prop-types';
import { LayoutConsumer } from '../../../../layout';
import { Box, Recursive, Touchable, Text } from '../../../index';

class InputTagSuggestion extends Component {
  static propTypes = {
    renderProp: object,
    item: object,
    itemString: string,
    isSelected: bool,
    isHighlighted: bool,
    touchableProps: object,
    allowMultipleSelection: bool,
    functions: object,
  }

  render() {
    const {
      renderProp,
      item,
      itemString,
      isSelected,
      isHighlighted,
      allowMultipleSelection,
      functions,
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
      >
        {
          renderProp
            ? (
              <LayoutConsumer>
                {layout => {
                  const context = {
                    item: {
                      ...item,
                      selected: isSelected,
                    },
                    layout,
                  };

                  return (
                    <Recursive
                      {...renderProp}
                      context={context}
                    />
                  );
                }}
              </LayoutConsumer>
            )
            : (
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
            )
          }
      </Touchable>
    );
  }
}

export default InputTagSuggestion;
