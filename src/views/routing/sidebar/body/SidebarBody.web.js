import React, { Fragment } from 'react';
import { TouchableWithoutFeedback, Image } from 'react-native';
import { object, func, string, array } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Box, ScrollView } from '../../../components';
import { closeSidebar } from '../../../../redux/actions';
import SidebarMenu from './menu';

const Sidebar = ({ sidebar, closeSidebar, headerImage, sidebarItems }) => (
  <Fragment>

    <Box
      position="fixed"
      left={-300}
      top={0}
      width={300}
      height="100%"
      backgroundColor="#232323"
      zIndex={100}
      transform={[
        { translateX: sidebar.isOpen ? 300 : 0 },
      ]}
      transitionDuration="300ms"
      transitionProperty="transform"
    >
      <ScrollView
        paddingY={40}
        flex={1}
        flexDirection
      >
        <Image
          resizeMode="contain"
          source={{ uri: headerImage, width: '100%', height: 200 }}
        />
        <SidebarMenu
          items={sidebarItems}
        />
      </ScrollView>
    </Box>

    {sidebar.isOpen && (
      <TouchableWithoutFeedback
        onPress={closeSidebar}
      >
        <Box
          position="fixed"
          top={0}
          left={0}
          height="100%"
          width="100%"
          zIndex={99}
          backgroundColor="#000"
          opacity={sidebar.isOpen ? 0.5 : 0}
          transition="300ms ease opacity"
        />
      </TouchableWithoutFeedback>
    )}
  </Fragment>
);

Sidebar.propTypes = {
  sidebar: object,
  closeSidebar: func,
  headerImage: string,
  sidebarItems: array,
};

Sidebar.defaultProps = {
  headerImage: ' ',
};

export { Sidebar };

const mapStateToProps = state => ({
  sidebar: state.sidebar,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ closeSidebar }, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( Sidebar );
