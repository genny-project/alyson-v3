import React, { Component } from 'react';
import { object, string, func } from 'prop-types';
import { LayoutConsumer } from '../../../../layout';
import { Box, Recursive, Touchable, Text, Icon } from '../../../index';

class InputTagItem extends Component {
  static propTypes = {
    renderProp: object,
    item: object,
    itemString: string,
    touchableProps: object,
    onPress: func,
  }

  render() {
    const {
      renderProp,
      item,
      itemString,
      touchableProps,
      onPress,
    } = this.props;

    if ( renderProp ) {
      return (
        <LayoutConsumer>
          {layout => {
            const context = {
              item: item,
              layout,
              onPress: onPress,
            };

            return (
              <Recursive
                {...renderProp}
                context={context}
              />
            );
          }}
        </LayoutConsumer>
      );
    }

    return (
      <Box
        alignItems="center"
        marginRight={10}
        marginBottom={10}
        borderWidth={2}
        borderRadius={20}
        borderColor="grey"
        paddingLeft={10}
        paddingRight={5}
        cleanStyleObject
      >
        <Box marginLeft={5}>
          <Text color="#grey">
            {itemString}
          </Text>
        </Box>

        <Touchable
          {...touchableProps}
        >
          <Icon
            type="material-icons"
            name="clear"
            color="grey"
          />
        </Touchable>
      </Box>
    );
  }
}

export default InputTagItem;
