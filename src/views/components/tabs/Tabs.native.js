import React, { Component, Fragment } from 'react';
import { ActivityIndicator, Dimensions,  Platform } from 'react-native';
import { any, array, bool, string, number, oneOfType, func, object, oneOf } from 'prop-types';
import { PagerScroll, PagerPan, TabView, TabBar } from 'react-native-tab-view';
import { Box, Text, Icon, Timeout } from '../../components';
import TabDots from './tab-dots';
import { isArray, Bridge } from '../../../utils';

class Tabs extends Component {
  static defaultProps = {
    tabs: [],
    labelProps: {},
    indicatorProps: {},
    sceneProps: {},
    dotProps: {},
    tabBarProps: {},
    tabsPosition: 'bottom',
    testID: 'tabs',
    numberOfAdjacentRoutesToRender: 1,
  }

  static propTypes = {
    children: any,
    tabs: array,
    height: oneOfType(
      [string, number]
    ),
    width: oneOfType(
      [string, number]
    ),
    tabBarBackground: string,
    tabBackground: string,
    activeTabBackground: string,
    tabBarSize: string,
    iconColor: string,
    labelColor: string,
    tabsPosition: oneOf(
      ['top', 'bottom']
    ),
    tabBarProps: object,
    onPress: func,
    scrollEnabled: bool,
    iconSize: string,
    iconProps: object,
    renderIcon: object,
    labelProps: object,
    indicatorProps: object,
    sceneProps: object,
    activeLabelColor: string,
    activeIconColor: string,
    restrictSceneHeights: bool,
    showDots: bool,
    dotsPosition: oneOf(
      ['top', 'bottom']
    ),
    dotProps: object,
    testID: string,
    parentRoute: string,
    numberOfAdjacentRoutesToRender: number,
  }

  static getDerivedStateFromProps( nextProps, nextState ) {
    if (
      nextProps.tabs != null &&
      nextProps.tabs !== nextState.routes
    ) {
      return { routes: nextProps.tabs };
    }

    return null;
  }

  state = {
    index: 0,
    routes: [],
    sceneHeights: {},
  }

  shouldRenderDots = ( requiredDotsPosition, requiredTabsPosition ) => {
    const { showDots, dotsPosition, tabsPosition, children, dotProps } = this.props;
    const { index } = this.state;

    if (
      !showDots ||
      !isArray( children, { ofMinLength: 1 }) ||
      dotsPosition !== requiredDotsPosition ||
      tabsPosition !== requiredTabsPosition
    ) {
      return null;
    }

    return (
      <TabDots
        {...dotProps}
        numberOfDots={children.length}
        currentIndex={index}
      />
    );
  }

  handleIndexChange = index => {
    const routeObject = this.state.routes.filter( x => x.key === index )[0];

    Bridge.sendEvent({
      event: 'BTN',
      eventType: 'ROUTE_CHANGE',
      sendWithToken: true,
      data: {
        code: `${this.props.parentRoute}${routeObject ? `/${routeObject.route}` : ''}`,
        value: routeObject ? `${routeObject.key}` : '',
      },
    });

    this.setState({ index });
  }

  handlePress = () => {
    if ( this.props.onPress )
      this.props.onPress();
  }

  handleSceneHeight = ( route ) => ( event ) => {
    var { height } = event.nativeEvent.layout;

    this.setState( state => ({
      sceneHeights: {
        ...state.sceneHeights,
        [route && route.key]: height,
      },
    }));
  }

  renderPager = ( props ) => {
    return ( Platform.OS === 'ios' ) ? <PagerScroll {...props} /> : <PagerPan {...props} />;
  }

  renderIcon = ({ route }) => {
    const { iconColor, iconSize, iconProps, activeIconColor } = this.props;

    const color = (
      activeIconColor &&
      route.key === this.state.index
    )
      ? activeIconColor
      : iconColor;

    return route.icon
      ? (
        <Icon
          {...iconProps}
          name={route.icon}
          size={iconSize}
          color={color}
        />
      )
      : null;
  }

  renderLabel = ({ route }) => {
    const { labelColor, labelProps, activeLabelColor } = this.props;
    const {
      paddingX = 5,
      paddingY = 5,
      padding,
      paddingTop,
      paddingLeft,
      paddingBottom,
      paddingRight,
      minHeight = 40,
      height,
      maxHeight,
      justifyContent = 'center',
      alignItems = 'center',
      ...textProps
    } = labelProps;

    return (
      <Box
        padding={padding}
        paddingY={paddingY}
        paddingX={paddingX}
        paddingTop={paddingTop}
        paddingLeft={paddingLeft}
        paddingBottom={paddingBottom}
        paddingRight={paddingRight}
        height={height}
        minHeight={minHeight}
        maxHeight={maxHeight}
        alignItems={alignItems}
        justifyContent={justifyContent}
      >
        <Text
          align="center"
          {...textProps}
          color={(
            activeLabelColor &&
            route.key === this.state.index
          )
            ? activeLabelColor
            : labelColor}
        >
          {route.title}
        </Text>
      </Box>
    );
  }

  renderTabBar = props => {
    const {
      tabBarBackground,
      activeTabBackground,
      scrollEnabled,
      indicatorProps,
      tabBarProps,
    } = this.props;

    const style = {
      backgroundColor: tabBarBackground,
      ...tabBarProps,
    };

    const indicatorStyle = {
      height: '100%',
      backgroundColor: activeTabBackground,
      ...indicatorProps,
    };

    return (
      <Fragment>
        {
          this.shouldRenderDots( 'top', 'top' )
        }
        <TabBar
          {...props}
          onTabPress={this.handlePress}
          scrollEnabled={scrollEnabled}
          renderLabel={this.renderLabel}
          renderIcon={this.renderIcon}
          style={style}
          indicatorStyle={indicatorStyle}
        />
        {
          this.shouldRenderDots( 'bottom', 'bottom' )
        }
      </Fragment>
    );
  };

  renderScene = ({ route }) => {
    const { sceneProps, restrictSceneHeights, numberOfAdjacentRoutesToRender } = this.props;
    const { sceneHeights, index, routes } = this.state;
    let { children } = this.props;

    /* Only render the scene if it's within 2 routes either side of the current route. */
    if ( Math.abs( index - routes.indexOf( route )) > numberOfAdjacentRoutesToRender ) {
      return <Box />;
    }

    const currentSceneHeight = sceneHeights[index] || 'auto';

    const height = (
      restrictSceneHeights
        ? index === route.key
          ? { flexBasis: currentSceneHeight, flexShrink: 1 }
          : { maxHeight: currentSceneHeight, flex: 0, flexGrow: 0 }
        : {}
    );

    const onLayout = restrictSceneHeights ? { onLayout: this.handleSceneHeight( route ) } : {};

    children = React.Children.map( children, child => {
      return (
        React.cloneElement( child, {
          ...child.props,
          props: {
            ...child.props.props || {},
            ...onLayout,
          },
        })
      );
    });

    const sceneStyle = {
      ...height,
      ...sceneProps,
    };

    return (
      <Box
        flex={1}
        justifyContent="center"
        position="relative"
        {...sceneStyle}
      >
        {(
          isArray( children, { ofMinLength: 1 }) &&
          children[route.key]
        )
          ? children[route.key]
          : (
            <Timeout duration={20000}>
              {({ isTimeUp }) => (
                <Box
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                  flex={1}
                  flexDirection="column"
                >
                  {isTimeUp ? (
                    <Text
                      align="center"
                    >
                      No items to display
                    </Text>
                  ) : (
                    <Fragment>
                      <ActivityIndicator size="large" />

                      <Box height={10} />

                      <Text align="center">
                        Loading...
                      </Text>
                    </Fragment>
                  )}
                </Box>
              )}
            </Timeout>
          )}
      </Box>
    );
  }

  render() {
    const { tabsPosition, testID } = this.props;
    const { index, routes } = this.state;
    const initialLayout = {
      height: 20,
      width: Dimensions.get( 'window' ).width,
    };

    const navigationState = {
      index,
      routes,
    };

    return (
      <Box
        height="100%"
        width="100%"
        flexDirection="column"
        testID={testID}
      >
        {
          this.shouldRenderDots( 'top', 'bottom' )
        }
        <TabView
          style={{
            height: '100%',
            width: '100%',
          }}
          navigationState={navigationState}
          renderScene={this.renderScene}
          renderTabBar={this.renderTabBar}
          onIndexChange={this.handleIndexChange}
          initialLayout={initialLayout}
          renderPager={this.renderPager}
          tabBarPosition={tabsPosition}
        />
        {
          this.shouldRenderDots( 'bottom', 'top' )
        }
      </Box>
    );
  }
}

export default Tabs;
