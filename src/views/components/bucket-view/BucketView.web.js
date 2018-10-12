import React, { PureComponent } from 'react';
import { string, number, any, object } from 'prop-types';
import { isArray } from '../../../utils';
import { Box, Text } from '../../components';

class BucketView extends PureComponent {
  static propTypes = {
    children: any,
    padding: number,
    gutter: number,
    backgroundColor: string,
    alternateBackgroundColor: string,
    contentProps: object,
  }

  render() {
    const {
      padding,
      gutter,
      backgroundColor,
      alternateBackgroundColor,
      children,
      contentProps,
      ...restProps
    } = this.props;

    return (
      <Box
        {...restProps}
        width="100%"
        height="100%"
        padding={padding}
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
                {...contentProps}
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
