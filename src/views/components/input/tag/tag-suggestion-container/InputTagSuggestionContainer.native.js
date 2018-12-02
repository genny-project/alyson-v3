import React, { Component } from 'react';
import { node, bool, func, string, object } from 'prop-types';
import { Box, Modal, SafeAreaView, Touchable, Icon, Input, ScrollView } from '../../../index';

class InputTagSuggestionContainer extends Component {
  static propTypes = {
    children: node,
    isOpen: bool,
    onPressClose: func,
    onPressClear: func,
    onPressItem: func,
    inputValue: string,
    allowMultipleSelection: bool,
    selectMultipleItems: func,
    inputProps: object,
  }

  render() {
    const {
      children,
      isOpen,
      onPressClose,
      onPressClear,
      onPressItem,
      inputValue,
      allowMultipleSelection,
      inputProps,

    } = this.props;

    return (
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
            position="relative"
          >
            <Box
              position="absolute"
              height="100%"
              alignItems="center"
              left={0}
              zIndex={5}
            >
              <Touchable
                withFeedback
                onPress={onPressClose}
              >
                <Box
                  paddingX={10}
                >
                  <Icon
                    name="arrow-back"
                    color="black"
                    size="md"
                  />
                </Box>
              </Touchable>
            </Box>

            <Input
              {...inputProps}
            />

            { allowMultipleSelection ? (
              <Touchable
                withFeedback
                onPress={onPressItem}
              >
                <Box
                  height="100%"
                  alignItems="center"
                  padding={10}
                  borderBottomWidth={2}
                  borderColor="#DDD"
                  borderStyle="solid"
                  backgroundColor="#DDD"
                >
                  <Icon
                    name="done"
                    color="black"
                    size="md"
                  />
                </Box>
              </Touchable>
            ) : null}

            { inputValue ? (
              <Box
                position="absolute"
                height="100%"
                alignItems="center"
                right={allowMultipleSelection ? 50 : 10}
                zIndex={5}
              >
                { inputValue ? (
                  <Touchable
                    withFeedback
                    onPress={onPressClear}
                  >
                    <Icon
                      name="close"
                      color="black"
                      size="md"
                    />
                  </Touchable>
                ) : null }
              </Box>
            ) : null}
          </Box>
          <ScrollView
            width="100%"
            flex={1}
          >
            {children}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  }
}

export default InputTagSuggestionContainer;
