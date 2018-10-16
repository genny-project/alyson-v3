import React, { PureComponent } from 'react';
import { any } from 'prop-types';
import { Box } from '../../components';

class BlurView extends PureComponent {
  static propTypes = {
    children: any,
  };

  render() {
    return (
      <Box
        opacity={0.4}
        testID="blur-view"
      >
        {this.props.children}
      </Box>
    );
  }
}

export default BlurView;
