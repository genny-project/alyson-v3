import React from 'react';
import { Image } from 'react-native';
import { string } from 'prop-types';
import { ScrollView, Box } from '../../components';
import SidebarMenu from './menu';
import { sidebar as sidebarItems } from '../../../config';

const Sidebar = props => (
  <Box
    flex={1}
    flexDirection="column"
    paddingY={20}
    backgroundColor="#232323"
  >

    <Box flex={1}>
      <Image
        style={{
          resizeMode: 'contain',
        }}
        flex={1}
        source={{ uri: props.headerImage }}
      />

    </Box>

    <Box flex={4}>
      <ScrollView>
        <SidebarMenu
          items={sidebarItems}
        />
      </ScrollView>

    </Box>

  </Box>
);

Sidebar.propTypes = {
  headerImage: string,
};

export default Sidebar;
