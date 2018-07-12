import React, { Component } from 'react';
import { Image } from 'react-native';
import { string, array, object } from 'prop-types';
import { withNavigation } from 'react-navigation';
import { ScrollView, Box } from '../../../components';
import { LayoutConsumer } from '../../../layout';
import SidebarMenu from './menu';

class Sidebar extends Component {
  static propTypes = {
    headerImage: string,
    items: array,
    navigation: object,
  }

  handleCloseSidebar = () => {
    this.props.navigation.navigate( 'DrawerClose' );
  }

  render() {
    const { headerImage, items } = this.props;

    return (
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
                  onPress={this.handleCloseSidebar}
                />
              </Box>
            </Box>
          </ScrollView>
        )}
      </LayoutConsumer>
    );
  }
}

export default withNavigation( Sidebar );
