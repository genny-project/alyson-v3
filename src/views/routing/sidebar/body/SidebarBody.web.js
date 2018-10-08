import React, { Fragment } from 'react';
import { TouchableWithoutFeedback, Image } from 'react-native';
import { object, func, string, array, number, bool, oneOfType, oneOf } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Box, ScrollView, Recursive } from '../../../components';
import { onClose } from '../../../../redux/actions';
import SidebarMenu from './menu';

const Sidebar = ({
  sidebar,
  onClose,
  headerImage,
  items,
  inline,
  width,
  backgroundColor,
  renderBody,
  openProps,
  closedProps,
  headerImageWidth = '100%',
  headerImageHeight = 200,
  side = 'left',
  backdropProps,
}) => {
  const context = {
    items,
    sidebar,
    onClose,
  };

  return (
    <Fragment>
      <Box
        {...!inline && {
          position: 'fixed',
          top: 0,
          ...side === 'left' ? {
            left: -width,
            transform: [
              { translateX: sidebar.left.isOpen ? width : 0 },
            ],
          } : {
            right: -width,
            transform: [
              { translateX: sidebar.right.isOpen ? -width : 0 },
            ],
          },
        }}
        width={300}
        height="100%"
        backgroundColor={backgroundColor}
        transitionDuration="300ms"
        transitionProperty="transform"
        {...sidebar[side].isOpen ? {
          zIndex: 100,
          ...openProps,
        } : {
          zIndex: 98,
          ...closedProps,
        }}
      >
        {renderBody ? (
          <Recursive
            {...renderBody}
            context={context}
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
        sidebar[side].isOpen
      ) && (
        <TouchableWithoutFeedback
          onPress={onClose}
        >
          <Box
            position="fixed"
            top={0}
            left={0}
            height="100%"
            width="100%"
            zIndex={99}
            backgroundColor="#000"
            opacity={sidebar[side].isOpen ? 0.5 : 0}
            transition="300ms ease opacity"
            {...backdropProps}
          />
        </TouchableWithoutFeedback>
      )}
    </Fragment>
  );
};

Sidebar.propTypes = {
  sidebar: object,
  onClose: func,
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
  openProps: object,
  closedProps: object,
  side: oneOf( ['left','right'] ),
  backdropProps: object,
};

export { Sidebar };

const mapStateToProps = state => ({
  sidebar: state.sidebar,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ onClose }, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( Sidebar );
