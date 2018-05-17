import React from 'react';
import { Image } from 'react-native';
import { string, array } from 'prop-types';
import { ScrollView, Box } from '../../../components';
import SidebarMenu from './menu';

const Sidebar = ({ headerImage, items }) => (
  <Box
    flex={1}
    flexDirection="column"
    paddingY={20}
    backgroundColor="#232323"
  >
    <Box>
      <Image
        style={{
          resizeMode: 'contain',
        }}
        flex={1}
        source={{ uri: headerImage }}
      />
    </Box>

    <Box>
      <ScrollView>
        <SidebarMenu
          items={items}
        />
      </ScrollView>
    </Box>
  </Box>
);

Sidebar.propTypes = {
  headerImage: string,
  items: array,
};

export default Sidebar;
