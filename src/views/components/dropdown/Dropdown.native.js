import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { array, string, bool, number } from 'prop-types';
import { Box, Icon, Text, PopupMenu } from '../../components';
// import DropdownItem from './item';

class Dropdown extends Component {
  static defaultProps = {
    padding: 20,
  }

  static propTypes = {
    items: array.isRequired,
    text: string.isRequired,
    facingRight: bool,
    padding: number,
    paddingX: number,
    paddingY: number,
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
    if ( this.picker ) {
      // this.picker.click();
      // this.picker.click();
    }
  }

  handleValueChange = itemValue => {
    console.warn( new Error( itemValue ));
  }

  render() {
    const { items, text, iconWhenTextHidden, facingRight, padding, paddingX, paddingY } = this.props; // eslint-disable-line

    return (
      <PopupMenu
        items={items}
        deriveTextFromItems={item => item.text}
      >
        {({ showPopupMenu, setAnchorRef }) => (
          <TouchableOpacity
            onPress={showPopupMenu}
            ref={setAnchorRef}
            style={{ alignItems: 'center' }}
          >
            <Box
              justifyContent="space-between"
              alignItems="center"
              padding={padding}
              paddingX={paddingX}
              paddingY={paddingY}
            >
              <Text
                color="white"
                size="md"
              >
                {text}
              </Text>

              <Box width={5} />

              <Icon
                name="expand-more"
                color="white"
                size="sm"
              />
            </Box>
          </TouchableOpacity>
        )}
      </PopupMenu>
    );
  }
}

export default Dropdown;
