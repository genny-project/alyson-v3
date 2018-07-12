import React, { Component } from 'react';
import { func, string } from 'prop-types';
import { LayoutConsumer } from '../../../../../layout';
import { Link, Box, Icon, Text, Touchable } from '../../../../../components';

class SidebarMenuItem extends Component {
  static propTypes = {
    name: string,
    path: string,
    iconLeft: string,
    iconRight: string,
    onPress: func,
  }

  render() {
    const { name, onPress, path, iconLeft, iconRight } = this.props;

    const element = (
      <LayoutConsumer>
        {layout => (
          <Box
            paddingY={10}
            flex={1}
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Box
              flex={1}
              alignItems="center"
            >
              <Box paddingX={15}>
                {iconLeft ? (
                  <Icon
                    name={iconLeft}
                    color={layout.textColor}
                  />
                ) : (
                  <Box width={24} />
                )}
              </Box>

              <Text color={layout.textColor}>
                {name}
              </Text>
            </Box>

            {iconRight ? (
              <Box paddingX={15}>
                <Icon
                  name={iconRight}
                  color={layout.textColor}
                />
              </Box>
            ) : null}
          </Box>
        )}
      </LayoutConsumer>
    );

    if ( path ) {
      return (
        <Link
          to={path}
          onPress={onPress}
        >
          {element}
        </Link>
      );
    }

    return (
      <Touchable
        withFeedback
        onPress={onPress}
      >
        {element}
      </Touchable>
    );
  }
}

export default SidebarMenuItem;
