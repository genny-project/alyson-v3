import React from 'react';
import { Image } from 'react-native';
import { string, array } from 'prop-types';
import { ScrollView, Box } from '../../../components';
import { LayoutConsumer } from '../../../layout';
import SidebarMenu from './menu';

const Sidebar = ({ headerImage, items }) => (
  <LayoutConsumer>
    {layout => (
      <ScrollView
        backgroundColor={layout.appColor}
      >
        <Box
          flexDirection="column"
          paddingY={20}
        >
          <Box>
            <Image
              style={{
                resizeMode: 'contain',
                width: '100%',
                height: 200,
              }}
              flex={1}
              source={{ uri: headerImage }}
            />
          </Box>

          <Box
            flexDirection="column"
          >
            <SidebarMenu
              items={items}
            />
          </Box>
        </Box>
      </ScrollView>
    )}
  </LayoutConsumer>
);

Sidebar.propTypes = {
  headerImage: string,
  items: array,
};

export default Sidebar;
