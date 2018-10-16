import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { array, string, number, func, node, bool } from 'prop-types';
import { store } from '../../../redux';
import { routes } from '../../../config';
import { Box, Icon, Text, PopupMenu } from '../../components';

class Dropdown extends Component {
  static defaultProps = {
    padding: 20,
    textColor: '#000',
    testID: 'dropdown',
  }

  static propTypes = {
    items: array.isRequired,
    text: node.isRequired,
    padding: number,
    paddingX: number,
    paddingY: number,
    onSelect: func,
    textColor: string,
    disabled: bool,
    testID: string,
  }

  handleSelect = item => {
    if (
      item &&
      item instanceof Object &&
      item.href
    ) {
      store.dispatch(
        NavigationActions.navigate({
          routeName: routes[item.href] ? item.href : 'generic',
          params: {
            layout: item.href,
          },
        }),
      );
    }

    if ( this.props.onSelect )
      this.props.onSelect( item );
  }

  render() {
    const { items, text, padding, paddingX, paddingY, textColor, disabled, testID } = this.props;

    return (
      <PopupMenu
        items={items}
        deriveTextFromItems={item => item.text}
        onSelect={this.handleSelect}
        testID={testID}
      >
        {({ showPopupMenu, setAnchorRef }) => (
          <TouchableOpacity
            onPress={
              !disabled
                ? showPopupMenu
                : null
              }
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
              {typeof text === 'string' ? (
                <Text
                  color={textColor}
                  size="md"
                >
                  {text}
                </Text>
              ) : text}

              <Box width={5} />

              <Icon
                name="more-vert"
                color={textColor}
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
