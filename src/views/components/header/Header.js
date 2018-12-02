import React, { Component } from 'react';
import { string, object, number, oneOfType, shape, arrayOf, bool, oneOf } from 'prop-types';
import { connect } from 'react-redux';
import { Box, Recursive } from '../index';
import HeaderLeft from './left';
import HeaderRight from './right';
import { LayoutConsumer } from '../../layout';
// import { PropInjection } from '../prop-injection';

const headerItemPropTypes = shape({
  icon: string,
  href: string,
  text: string,
  dropdown: bool,
  items: arrayOf( headerItemPropTypes ),
});

class Header extends Component {
  static defaultProps = {
    paddingX: 5,
    height: 60,
    testID: 'header',
  }

  static propTypes = {
    height: oneOfType(
      [string, number]
    ),
    padding: oneOfType(
      [string, number]
    ),
    paddingX: oneOfType(
      [string, number]
    ),
    paddingY: oneOfType(
      [string, number]
    ),
    boxShadow: string,
    barStyle: string,
    backgroundColor: string,
    layout: object,
    title: string,
    headerLeft: shape({
      showMenu: oneOfType(
        [bool, arrayOf( oneOf( ['ios', 'native', 'android', 'web'] ))]
      ),
      showTitle: oneOfType(
        [bool, arrayOf( oneOf( ['ios', 'native', 'android', 'web'] ))]
      ),
      showLogo: oneOfType(
        [bool, arrayOf( oneOf( ['ios', 'native', 'android', 'web'] ))]
      ),
      showBack: oneOfType(
        [bool, arrayOf( oneOf( ['ios', 'native', 'android', 'web'] ))]
      ),
    }),
    headerRight: shape({
      items: arrayOf( headerItemPropTypes ),
    }),
    navigation: object,
    renderHeader: object,
    user: object,
    testID: string,
  }

  render() {
    const {
      backgroundColor,
      height,
      paddingX,
      paddingY,
      padding,
      boxShadow,
      headerLeft,
      headerRight,
      navigation,
      renderHeader,
      layout,
      title,
      user,
      testID,
      ...restProps
    } = this.props;

    if ( renderHeader ) {
      const context = {
        title: layout.title,
        user,
      };

      return (
        <Recursive
          context={context}
          {...renderHeader}
        />
      );
    }

    return (
      <Box
        {...restProps}
        height={height}
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        backgroundColor={backgroundColor || layout.appColor}
        paddingX={paddingX}
        paddingY={paddingY}
        padding={padding}
        boxShadow={boxShadow}
        testID={testID}
      >
        <HeaderLeft
          {...headerLeft}
          stackNavigation={navigation}
          title={title}
        />
        <HeaderRight {...headerRight} />
      </Box>
    );
  }
}

const mapStateToProps = state => ({
  user: state.vertx.user,
});

export default connect( mapStateToProps )(
  props => (
    <LayoutConsumer>
      {layout => (
        <Header
          {...props}
          layout={layout}
        />
      )}
    </LayoutConsumer>
  )
);
