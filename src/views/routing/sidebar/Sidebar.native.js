import React from 'react';
import { ScrollView, Box } from '../../components';
import SidebarMenu from './menu';
import { sidebar as sidebarItems } from '../../../config';

const Sidebar = () => (
  <Box
    flex={1}
    paddingY={20}
    backgroundColor="#232323"
  >
    <ScrollView>
      <SidebarMenu
        items={sidebarItems}
      />
    </ScrollView>
  </Box>
);

export default Sidebar;
