import React from 'react';
import { SafeAreaView } from 'react-native';
import { Box, StatusBar } from '../../components';
import HeaderLeft from './left';
import HeaderRight from './right';

const Header = () => (
  <SafeAreaView>
    <StatusBar
      barStyle="light-content"
      backgroundColor="#232323"
    >
      <Box
        height={60}
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        backgroundColor="#232323"
        paddingX={5}
      >
        <HeaderLeft />

        <HeaderRight />
      </Box>
    </StatusBar>
  </SafeAreaView>
);

export default Header;