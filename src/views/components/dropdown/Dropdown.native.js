import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import { array, string, number, func, object } from 'prop-types';
import { Box, Icon, Text, PopupMenu } from '../../components';

class Dropdown extends Component {
  static defaultProps = {
    padding: 20,
  }

  static propTypes = {
    items: array.isRequired,
    text: string.isRequired,
    padding: number,
    paddingX: number,
    paddingY: number,
    onSelect: func,
    navigation: object,
  }

  handleSelect = item => {
    if (
      item &&
      typeof item === 'object' &&
      item.href
    ) {
      this.props.navigation.navigate( item.href );
    }

    if ( this.props.onSelect )
      this.props.onSelect( item );
  }

  render() {
    const { items, text, padding, paddingX, paddingY } = this.props;

    return (
      <PopupMenu
        items={items}
        deriveTextFromItems={item => item.text}
        onSelect={this.handleSelect}
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

export default withNavigation( Dropdown );
