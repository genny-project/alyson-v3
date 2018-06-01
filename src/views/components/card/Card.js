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
    size: oneOf(
      'sm', 'md', 'lg'
    ),
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
      size,
      shadow,
      roundCorners,
    } = this.props;

    const width = {
      sm: 200,
      md: 400,
      lg: 600,
    };

    return (
      <Box
        alignItems="center"
        justifyContent="center"
        width={width[size] || '100%'}
        backgroundColor={background}
        padding={padding}
        borderRadius={roundCorners ? 5 : 0}
        boxShadow={shadow || null}
      >
        {children}
      </Box>
    );
  }
}

export default Card;
