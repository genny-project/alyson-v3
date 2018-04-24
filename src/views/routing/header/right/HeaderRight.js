import React from 'react';
import { Box } from '../../../components';
import HeaderItem from '../item';

const HeaderLeft = () => (
  <Box paddingX={5}>
    <HeaderItem
      href="chat"
      icon="chat"
    />

    <HeaderItem
      href="alerts"
      icon="notifications"
    />

    <HeaderItem
      href="profile"
      icon="person"
    />
  </Box>
);

export default HeaderLeft;
