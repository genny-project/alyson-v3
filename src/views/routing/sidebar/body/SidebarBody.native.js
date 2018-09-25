import React, { Component, Fragment } from 'react';
import { Image } from 'react-native';
import { string, array, object } from 'prop-types';
import { withNavigation } from 'react-navigation';
import { ScrollView, Box, Sublayout } from '../../../components';
import { LayoutConsumer } from '../../../layout';
import SidebarMenu from './menu';

class Sidebar extends Component {
  static propTypes = {
    headerImage: string,
    items: array,
    navigation: object,
    sidebarItemProps: object,
    sidebarLayout: string,
    headerLayout: string,
    footerLayout: string,
  }

  handleCloseSidebar = () => {
    this.props.navigation.navigate( 'DrawerClose' );
  }

  render() {
    const { 
      headerImage,
      items, 
      sidebarItemProps,
      sidebarLayout,
      headerLayout,
      footerLayout,
    } = this.props;

    return (
      <LayoutConsumer>
        {layout => {
          if ( sidebarLayout ) {
            return (
              <Sublayout
                {...layout}
                sidebarItemProps={sidebarItemProps}
                headerImage={headerImage}
                onPress={this.handleCloseSidebar}
                items={items}
                layoutName={sidebarLayout}
              />
            );
          }

          return (
            <Fragment>
              {
                headerLayout
                  ? (
                    <Sublayout
                      {...layout}
                      headerImage={headerImage}
                      layoutName={headerLayout}
                    />
                  )
                  : headerImage
                    ? ( 
                      <Box
                        marginBottom={20}
                      >
                        <Image
                          style={{
                            resizeMode: 'contain',
                            width: '100%',
                            height: 200,
                          }}
                          flex={1}
                          minWidth={40}
                          minHeight={40}
                          source={{ uri: headerImage }}
                        />
                      </Box>
                    )
                    : null
              }
              <ScrollView
                backgroundColor={layout.appColor}
              >
                <Box
                  flexDirection="column"
                >
                  <SidebarMenu
                    items={items}
                    onPress={this.handleCloseSidebar}
                    sidebarItemProps={sidebarItemProps}
                  />
                </Box>
              </ScrollView>
              {
                footerLayout
                  ? (
                    <Sublayout
                      {...layout}
                      layoutName={footerLayout}
                    />
                  )
                  : null
              }
            </Fragment>
          );
        }}
      </LayoutConsumer>
    );
  }
}

export default withNavigation( Sidebar );
