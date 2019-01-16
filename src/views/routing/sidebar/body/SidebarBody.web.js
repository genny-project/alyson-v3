import React, { Fragment } from 'react';
import { TouchableWithoutFeedback, Image } from 'react-native';
import { object, func, string, array, number, bool, oneOfType, oneOf } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Box, ScrollView, Recursive } from '../../../components';
import { onClose } from '../../../../redux/actions';
import { isObject, getDeviceSize } from '../../../../utils';
import SidebarMenu from './menu';

const Sidebar = ({
  sidebar,
  onClose,
  onToggle,
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
  sortDirection,
  sortBy,
}) => {
  const sortedItems = [...items];

  /* If both a sort direction and sort by are provided then sort the items */
  if ( sortDirection && sortBy ) {
    sortDirection === 'desc' ? sortedItems.sort(( a, b ) => b[sortBy] > a[sortBy] ? 1 : -1 ) : sortedItems.sort(( a, b ) => a[sortBy] > b[sortBy] ? 1 : -1 );
  }

  const deviceSize = getDeviceSize();

  const context = {
    items: sortedItems,
    sidebar,
    onClose,
    onToggle,
    deviceSize,
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
        width={
          isObject( width )
            ? width[deviceSize] != null
              ? width[deviceSize]
              : width['default']
            : width
        }
        height="100%"
        backgroundColor={backgroundColor}
        transitionDuration="300ms"
        transitionProperty="transform"
        {...sidebar[side].isOpen ? {
          zIndex: 100,
          ...(
            openProps[deviceSize] != null
              ? openProps[deviceSize]
              : openProps['default'] != null
                ? openProps['default']
                : openProps
          ),
        } : {
          zIndex: 98,
          ...closedProps,
        }}
        testID="sidebar-body"
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
  onToggle: func,
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
  sortDirection: oneOf( ['asc','desc'] ),
  sortBy: string,
};

export { Sidebar };

const mapStateToProps = state => ({
  sidebar: state.sidebar,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ onClose }, dispatch );
};

export default connect( mapStateToProps, mapDispatchToProps )( Sidebar );
