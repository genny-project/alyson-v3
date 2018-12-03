import React, { PureComponent } from 'react';
import { any, string, number, bool, oneOf } from 'prop-types';
import { Box } from '../../components';

class Card extends PureComponent {
  static defaultProps = {
    background: 'white',
    padding: 10,
    roundCorners: true,
    testID: 'card',
  }

  static propTypes = {
    children: any,
    background: string,
    padding: number,
    shadow: oneOf(
      ['light', 'medium', 'dark']
    ),
    roundCorners: bool,
    testID: string,
  }

  render() {
    const {
      children,
      background,
      padding,
      shadow,
      roundCorners,
      testID,
    } = this.props;

    return (
      <Box
        alignItems="center"
        justifyContent="center"
        width="100%"
        backgroundColor={background}
        padding={padding}
        borderRadius={roundCorners ? 5 : 0}
        boxShadow={shadow}
        testID={testID}
      >
        {children}
      </Box>
    );
  }
}

export default Card;
