import React, { Component, Fragment } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import { array, string, bool, number, node } from 'prop-types';
import { Box, Text, Icon } from '../../components';
import DropdownItem from './item';

class Dropdown extends Component {
  static defaultProps = {
    padding: 20,
    backgroundColor: '#FFF',
    textColor: '#000',
  }

  static propTypes = {
    items: array.isRequired,
    text: node.isRequired,
    facingRight: bool,
    padding: number,
    paddingX: number,
    paddingY: number,
    backgroundColor: string,
    textColor: string,
  }

  state = {
    isOpen: false,
    fadeAnim: new Animated.Value( 0 ),
    dropdownScaleY: new Animated.Value( 0 ),
  }

  handleOpen = () => {
    this.setState({ isOpen: true });

    Animated.parallel( [
      Animated.timing(
        this.state.fadeAnim,
        {
          toValue: 1,
          duration: 100,
        }
      ),
      Animated.timing(
        this.state.dropdownScaleY,
        {
          toValue: 1,
          duration: 120,
        }
      ),
    ] ).start();
  }

  handleClose = () => {
    Animated.parallel( [
      Animated.timing(
        this.state.fadeAnim,
        {
          toValue: 0,
          duration: 250,
        }
      ),
      Animated.timing(
        this.state.dropdownScaleY,
        {
          toValue: 0,
          duration: 300,
        }
      ),
    ] ).start(() => {
      this.setState({ isOpen: false });
    });
  }

  render() {
    const {
      items,
      text,
      facingRight,
      padding,
      paddingX,
      paddingY,
      textColor,
      backgroundColor,
    } = this.props;

    const { isOpen, fadeAnim, dropdownScaleY } = this.state;

    return (
      <Fragment>
        {isOpen && (
          <Animated.View
            style={{
              opacity: fadeAnim,
            }}
          >
            <TouchableWithoutFeedback
              onPress={this.handleClose}
            >
              <Box
                position="fixed"
                top={0}
                left={0}
                height="100%"
                width="100%"
                zIndex={74}
                backgroundColor="#000"
                opacity={0.1}
              />
            </TouchableWithoutFeedback>
          </Animated.View>
        )}

        <Box
          position="relative"
          zIndex={755}
        >
          <TouchableOpacity
            onPress={this.handleOpen}
          >
            <Box
              justifyContent="space-between"
              alignItems="center"
              padding={padding}
              paddingX={paddingX}
              paddingY={paddingY}
            >
              {typeof text === 'string' ? (
                <Text
                  color={textColor}
                >
                  {text}
                </Text>
              ) : text}

              <Box width={5} />

              <Icon
                name="expand-more"
                color={textColor}
              />
            </Box>
          </TouchableOpacity>

          {isOpen && (
            <Animated.View
              style={{
                transform: [
                  { scaleY: dropdownScaleY },
                  { scaleX: dropdownScaleY },
                ],
                opacity: fadeAnim,
                position: 'absolute',
                height: '100%',
                width: '100%',
              }}
            >
              <Box
                position="absolute"
                top="100%"
                backgroundColor={backgroundColor}
                flexDirection="column"
                minWidth={170}
                {...facingRight
                  ? { right: 0 }
                  : { left: 0 }
              }
              >
                {(
                  items &&
                  items instanceof Array &&
                  items.length > 0
                ) ? (
                    items.map( item => (
                      <DropdownItem
                        text={item.text}
                        icon={item.icon}
                        key={item.text}
                        href={item.href}
                        onPress={this.handleClose}
                        textColor={textColor}
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
            </Animated.View>
          )}
        </Box>
      </Fragment>
    );
  }
}

export default Dropdown;
