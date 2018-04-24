import React, { Fragment } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { object, func } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Box, ScrollView } from '../../components';
import { sidebar as sidebarItems } from '../../../config';
import { closeSidebar } from '../../../redux/actions';
import SidebarMenu from './menu';
import { View } from 'react-native-web';

const Sidebar = ({ sidebar, closeSidebar }) => (
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
        { translateX: sidebar.open ? 300 : 0 },
      ]}
      transition="300ms ease transform"
    >
      <ScrollView
        paddingY={40}
        flex={1}
      >
        <SidebarMenu
          items={sidebarItems}
        />
      </ScrollView>
    </Box>

    {sidebar.open && (
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
          opacity={sidebar.open ? 0.5 : 0}
          transition="300ms ease opacity"
        />
      </TouchableWithoutFeedback>
    )}
  </Fragment>
);

Sidebar.propTypes = {
  sidebar: object,
  closeSidebar: func,
};

export { Sidebar };

const mapStateToProps = state => ({
  sidebar: state.sidebar,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ closeSidebar }, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( Sidebar );
