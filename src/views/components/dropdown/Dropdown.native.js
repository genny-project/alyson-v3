import React, { Component, Fragment } from 'react';
import { TouchableOpacity } from 'react-native';
import { array, string, bool } from 'prop-types';
import { Box, Icon } from '../../components';
// import DropdownItem from './item';

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

  render() {
    const { items, text, iconWhenTextHidden, facingRight } = this.props; // eslint-disable-line
    // const { isOpen } = this.state;

    return (
      <Fragment>
        <TouchableOpacity
          onPress={this.handleOpen}
        >
          <Box
            justifyContent="space-between"
            alignItems="center"
            padding={5}
          >
            <Icon
              name={iconWhenTextHidden}
              color="white"
              size="md"
            />
          </Box>
        </TouchableOpacity>
      </Fragment>
    );
  }
}

export default Dropdown;
