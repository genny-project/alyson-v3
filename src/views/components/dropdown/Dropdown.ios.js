import React, { PureComponent, Fragment } from 'react';
import { Modal, StyleSheet } from 'react-native';
import { BlurView } from 'expo';
import { array, string, bool, number, node } from 'prop-types';
import { Box, Text, Icon, Touchable } from '../../components';
import DropdownItem from './item';

class Dropdown extends PureComponent {
  static defaultProps = {
    padding: 20,
    textColor: '#000',
  }

  static propTypes = {
    items: array.isRequired,
    text: node.isRequired,
    padding: number,
    paddingX: number,
    paddingY: number,
    textColor: string,
    disabled: bool,
  }

  state = {
    isOpen: false,
  }

  handleOpen = () => {
    if ( this.props.disabled )
      return;

    this.setState({ isOpen: true });
  }

  handleClose = () => {
    this.setState({ isOpen: false });
  }

  handleToggle = () => {
    if ( this.props.disabled )
      return;

    this.setState( state => ({ isOpen: !state.isOpen }));
  }

  render() {
    const {
      items,
      text,
      padding,
      paddingX,
      paddingY,
      textColor,
    } = this.props;

    const { isOpen } = this.state;

    return (
      <Fragment>
        <Box zIndex={110}>
          <Touchable
            withFeedback
            onPress={this.handleToggle}
          >
            <Box
              justifyContent="space-between"
              alignItems="center"
              padding={padding}
              paddingX={paddingX}
              paddingY={paddingY}
              onLayout={this.handleLayout}
            >
              {typeof text === 'string' ? (
                <Text
                  color={textColor}
                >
                  {text}
                </Text>
              ) : text}

              <Icon
                name="expand-more"
                color={textColor}
              />
            </Box>
          </Touchable>
        </Box>

        <Modal
          animationType="fade"
          visible={isOpen}
          transparent
        >
          <BlurView
            style={StyleSheet.absoluteFill}
            intensity={75}
          />

          <Touchable
            onPress={this.handleClose}
          >
            <Box
              paddingX={20}
              width="100%"
              height="100%"
              justifyContent="center"
              alignItems="center"
              zIndex={10}
            >
              <Box
                width="100%"
                backgroundColor="white"
                flexDirection="column"
                position="relative"
                borderRadius={10}
                flex={1}
                borderStyle="solid"
                borderWidth={2}
                borderColor="#DDD"
              >
                <Box
                  position="absolute"
                  right={10}
                  bottom="100%"
                  borderLeftWidth={10}
                  borderRightWidth={10}
                  borderBottomWidth={15}
                  borderStyle="solid"
                  borderLeftColor="transparent"
                  borderRightColor="transparent"
                  borderBottomColor="white"
                />

                <Box
                  justifyContent="space-between"
                  alignItems="center"
                  padding={10}
                >
                  <Text
                    color="grey"
                    size="xs"
                  >
                    Menu options
                  </Text>

                  <Icon
                    name="clear"
                    color="grey"
                    size="sm"
                  />
                </Box>

                {(
                  items &&
                  items instanceof Array &&
                  items.length > 0
                ) ? (
                    items.map(( item, index ) => (
                      <DropdownItem
                        text={item.text}
                        icon={item.icon}
                        key={item.text}
                        href={item.href}
                        onPress={this.handleClose}
                        textColor="black"
                        borderBottomColor={index < items.length && 'black'}
                      />
                    ))
                  ) : (
                    <DropdownItem
                      text="No items to show."
                      onPress={this.handleClose}
                      textColor={textColor}
                    />
                  )}
              </Box>
            </Box>
          </Touchable>
        </Modal>
      </Fragment>
    );
  }
}

export default Dropdown;
