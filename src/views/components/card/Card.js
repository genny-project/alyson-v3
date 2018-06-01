import React, { PureComponent } from 'react';
import { any, string, number, bool, oneOf } from 'prop-types';
import { Box } from '../../components';

class Card extends PureComponent {
  static defaultProps = {
    background: 'white',
    padding: 10,
    roundCorners: true,
  }

  static propTypes = {
    children: any,
    background: string,
    padding: number,
    shadow: oneOf(
      ['light', 'medium', 'dark']
    ),
    roundCorners: bool,
  }

  render() {
    const {
      children,
      background,
      padding,
      shadow,
      roundCorners,
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
      >
        {children}
      </Box>
    );
  }
}

export default Card;
