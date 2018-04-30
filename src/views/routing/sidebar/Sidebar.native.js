import React from 'react';
import { SafeAreaView } from 'react-native';
import { ScrollView, Box } from '../../components';
import SidebarMenu from './menu';
import { sidebar as sidebarItems } from '../../../config';

const Sidebar = () => (
  <SafeAreaView
    style={{
      flex: 1,
      backgroundColor: '#232323',
    }}
  >
    <Box
      flex={1}
      paddingY={20}
    >
      <ScrollView>
        <SidebarMenu
          items={sidebarItems}
        />
      </ScrollView>
    </Box>
  </SafeAreaView>
);

export default Sidebar;
