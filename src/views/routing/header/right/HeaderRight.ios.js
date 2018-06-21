import React from 'react';
import { Box } from '../../../components';
import { LayoutConsumer } from '../../../layout';
import HeaderItem from '../item';

const HeaderRight = () => {
  return (
    <LayoutConsumer>
      {({ textColor }) => (
        <Box
          marginRight={10}
          alignItems="center"
        >
          <HeaderItem
            href="chat"
            icon="chat"
            textColor={textColor}
          />

          <HeaderItem
            href="profile"
            icon="account-circle"
            textColor={textColor}
          />
        </Box>
      )}
    </LayoutConsumer>
  );
};

export default HeaderRight;
