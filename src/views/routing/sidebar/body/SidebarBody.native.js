import React from 'react';
import { Image } from 'react-native';
import { string, array } from 'prop-types';
import { ScrollView, Box } from '../../../components';
import { LayoutConsumer } from '../../../layout';
import SidebarMenu from './menu';

const Sidebar = ({ headerImage, items }) => (
  <LayoutConsumer>
    {layout => (
      <Box
        flex={1}
        flexDirection="column"
        paddingY={20}
        backgroundColor={layout.appColor}
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

        <Box>
          <ScrollView>
            <SidebarMenu
              items={items}
            />
          </ScrollView>
        </Box>
      </Box>
    )}
  </LayoutConsumer>
);

Sidebar.propTypes = {
  headerImage: string,
  items: array,
};

export default Sidebar;
