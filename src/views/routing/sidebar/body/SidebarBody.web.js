import React, { Fragment } from 'react';
import { TouchableWithoutFeedback, Image } from 'react-native';
import { object, func, string, array, number, bool, oneOfType } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Box, ScrollView, Recursive } from '../../../components';
import { closeSidebar } from '../../../../redux/actions';
import SidebarMenu from './menu';

const Sidebar = ({
  sidebar,
  closeSidebar,
  headerImage,
  items,
  inline,
  width,
  backgroundColor,
  renderBody,
  headerImageWidth = '100%',
  headerImageHeight = 200,
}) => (
  <Fragment>
    <Box
      {...!inline && {
        position: 'fixed',
        left: -width,
        top: 0,
        transform: [
          { translateX: sidebar.isOpen ? width : 0 },
        ],
      }}
      width={300}
      height="100%"
      backgroundColor={backgroundColor}
      zIndex={100}
      transitionDuration="300ms"
      transitionProperty="transform"
    >
      {renderBody ? (
        <Recursive
          {...renderBody}
          context={{
            items,
          }}
        />
      ) : (
        <ScrollView
          paddingY={40}
          flex={1}
        >
          {headerImage ? (
            <Image
              resizeMode="contain"
              source={{ uri: headerImage, width: headerImageWidth, height: headerImageHeight }}
            />
          ) : null}

          <SidebarMenu
            items={items}
          />
        </ScrollView>
      )}
    </Box>

    {(
      !inline &&
      sidebar.isOpen
    ) && (
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
  items: array,
  width: number.isRequired,
  inline: bool,
  renderBody: object,
  backgroundColor: string,
  headerImageWidth: oneOfType(
    [number, string]
  ),
  headerImageHeight: oneOfType(
    [number, string]
  ),
};

export { Sidebar };

const mapStateToProps = state => ({
  sidebar: state.sidebar,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ closeSidebar }, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( Sidebar );
