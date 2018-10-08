import React, { PureComponent } from 'react';
import { string, number, any } from 'prop-types';
import { isArray } from '../../../utils';
import { Box, Text } from '../../components';

class BucketView extends PureComponent {
  static propTypes = {
    children: any,
    padding: number,
    gutter: number,
    backgroundColor: string,
    alternateBackgroundColor: string,
  }

  render() {
    const {
      padding,
      gutter,
      backgroundColor,
      alternateBackgroundColor,
      children,
      ...restProps
    } = this.props;

    return (
      <Box
        {...restProps}
        width="100%"
        padding={padding}
        flex={1}
        backgroundColor={backgroundColor}
      >
        <Box
          width="100%"
          flex={1}
        >
          {isArray( children, { ofMinLength: 1 }) ? (
            children.map(( child, index ) => (
              <Box
                key={child.props.id || index}
                flex={1}
                backgroundColor={index % 2 === 0 && alternateBackgroundColor}
                marginRight={(
                  index < children.length - 1
                    ? gutter
                    : null
                )}
              >
                {child}
              </Box>
            ))
          ) : (
            <Text>
              No items to display
            </Text>
          )}
        </Box>
      </Box>
    );
  }
}

export default BucketView;
