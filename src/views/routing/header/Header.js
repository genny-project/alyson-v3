import React from 'react';
import { Box, StatusBar } from '../../components';
import HeaderLeft from './left';
import HeaderRight from './right';
import { LayoutConsumer } from '../../layout';

const Header = () => (
  <LayoutConsumer>
    {layout => (
      <StatusBar
        barStyle="light-content"
        backgroundColor={layout.appColor}
      >
        <Box
          height={60}
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          backgroundColor={layout.appColor}
          paddingX={5}
          boxShadow="light"
        >
          <HeaderLeft />

          <HeaderRight />
        </Box>
      </StatusBar>
    )}
  </LayoutConsumer>
);

export default Header;
