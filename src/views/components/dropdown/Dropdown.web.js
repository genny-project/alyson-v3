import React, { Component, Fragment } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { array, string, bool } from 'prop-types';
import { Box, Text, Icon } from '../../components';
import DropdownItem from './item';

class Dropdown extends Component {
  static propTypes = {
    items: array.isRequired,
    text: string.isRequired,
    facingRight: bool,
  }

  state = {
    isOpen: false,
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

  render() {
    const { items, text, facingRight } = this.props;
    const { isOpen } = this.state;

    return (
      <Fragment>
        {isOpen && (
          <TouchableWithoutFeedback
            onPress={this.handleClose}
          >
            <Box
              position="fixed"
              top={0}
              left={0}
              height="100%"
              width="100%"
              zIndex={109}
              backgroundColor="#000"
              opacity={0.1}
            />
          </TouchableWithoutFeedback>
        )}

        <Box
          position="relative"
          zIndex={110}
        >
          <TouchableOpacity
            onPress={this.handleToggle}
          >
            <Box
              justifyContent="space-between"
              alignItems="center"
              padding={20}
            >
              <Text
                color="white"
              >
                {text}
              </Text>

              <Icon
                name="expand-more"
                color="white"
              />
            </Box>
          </TouchableOpacity>

          {isOpen && (
            <Box
              position="absolute"
              top="100%"
              width="100%"
              backgroundColor="#232323"
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
                  />
                ))
              ) : (
                <DropdownItem
                  text="No items to show."
                  onPress={this.handleClose}
                />
              )}
            </Box>
          )}
        </Box>
      </Fragment>
    );
  }
}

export default Dropdown;
