import React, { PureComponent, Fragment } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, Modal } from 'react-native';
import { array, string, bool, number, node } from 'prop-types';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { Box, Text, Icon } from '../../components';
import DropdownItem from './item';

class Dropdown extends PureComponent {
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
    buttonHeight: 0,
  }

  handleOpen = () => {
    this.setState({ isOpen: true });
  }

  handleClose = () => {
    this.setState({ isOpen: false });
  }

  handleToggle = () => {
    this.setState( state => ({ isOpen: !state.isOpen }));
  }

  handleLayout = ({ nativeEvent }) => {
    const { height } = nativeEvent.layout;

    this.setState({
      buttonHeight: height,
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

    const { isOpen, buttonHeight } = this.state;

    return (
      <Fragment>
        <Box zIndex={110}>
          <TouchableOpacity
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

              <Box width={5} />

              <Icon
                name="expand-more"
                color={textColor}
              />
            </Box>
          </TouchableOpacity>
        </Box>

        <Modal
          animationType="fade"
          visible={isOpen}
          transparent
        >
          <TouchableWithoutFeedback
            onPress={this.handleClose}
          >
            <Box
              flex={1}
              justifyContent="center"
              alignItems="center"
              backgroundColor="#000"
              opacity={0.5}
              width="100%"
              zIndex={10}
            />
          </TouchableWithoutFeedback>

          <Box
            position="absolute"
            top={(
              // TODO: improve positioning
              buttonHeight + (
                isIphoneX() ? 44 : 20
              )
            )}
            backgroundColor={backgroundColor}
            flexDirection="column"
            minWidth={170}
            zIndex={10}
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
        </Modal>
      </Fragment>
    );
  }
}

export default Dropdown;
