import React, { PureComponent } from 'react';
import { string, number, any } from 'prop-types';
import { Box, Text } from '../../components';

class BucketView extends PureComponent {
  static defaultProps = {
    padding: 20,
    gutter: 10,
  }

  static propTypes = {
    children: any,
    padding: number,
    gutter: number,
    backgroundColor: string,
  }

  render() {
    const {
      padding,
      gutter,
      backgroundColor,
      children,
    } = this.props;

    return (
      <Box
        width='100%'
        padding={padding}
        flex={1}
        backgroundColor={backgroundColor}
      >
        <Box
          width='100%'
          flex={1}
        >
          {(
            children != null &&
            children instanceof Array &&
            children.length > 0
          ) ? (
            children.map(( child, index ) => (
              <Box
                key={child.props.id || index}
                flex={1}
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
