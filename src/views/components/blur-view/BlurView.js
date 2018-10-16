import React, { PureComponent } from 'react';
import { any, string } from 'prop-types';
import { Box } from '../../components';

class BlurView extends PureComponent {
  static defaultProps = {
    testID: 'blur-view',
  };

  static propTypes = {
    children: any,
    testID: string,
  };

  render() {
    const { children, testID } = this.props;

    return (
      <Box
        opacity={0.4}
        testID={testID}
      >
        {children}
      </Box>
    );
  }
}

export default BlurView;
