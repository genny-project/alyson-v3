import React, { Component, Fragment } from 'react';
import { ActivityIndicator, Dimensions } from 'react-native';
import { any, array, bool, string, number, oneOfType, func, object } from 'prop-types';
import { TabView, TabBar } from 'react-native-tab-view';
import { Box, Text, Icon, Timeout } from '../../components';

class Tabs extends Component {
  static defaultProps = {
    tabs: [],
    height: '100%',
    width: '100%',
    labelProps: {},
    indicatorProps: {},
    sceneProps: {},
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
    bottomTabs: bool,
    onPress: func,
    scrollEnabled: bool,
    iconSize: string,
    iconProps: object,
    labelProps: object,
    indicatorProps: object,
    sceneProps: object,
    activeLabelColor: string,
    activeIconColor: string,
    restrictSceneHeights: bool,
    paddingBottom: number,
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

  handleIndexChange = index => {
    this.setState({ index });
  }

  handlePress = () => {
    if ( this.props.onPress )
      this.props.onPress();
  }

  handleSceneHeight = ( route ) =>  ( event ) => {
    var { height } = event.nativeEvent.layout;

    this.setState( state => ({
      sceneHeights: {
        ...state.sceneHeights,
        [route && route.key]: height,
      },
    }));
  }

  renderIcon = ({ route }) => {
    const { iconColor, iconSize, iconProps, activeIconColor } = this.props;

    return route.icon
      ? (
        <Icon
          {...iconProps}
          name={route.icon}
          size={iconSize}
          color={(
            activeIconColor &&
            route.key === this.state.index
          )
            ? activeIconColor
            : iconColor}
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
    } = this.props;

    const style = {
      backgroundColor: tabBarBackground,
    };

    const indicatorStyle = {
      height: '100%',
      backgroundColor: activeTabBackground,
      ...indicatorProps,
    };

    return (
      <TabBar
        {...props}
        onTabPress={this.handlePress}
        scrollEnabled={scrollEnabled}
        renderLabel={this.renderLabel}
        renderIcon={this.renderIcon}
        style={style}
        indicatorStyle={indicatorStyle}
      />
    );
  };

  renderScene = ({ route }) => {
    const { sceneProps, restrictSceneHeights } = this.props;
    const { sceneHeights, index, routes } = this.state;
    let { children } = this.props;

    /* Only render the scene if it's within 2 routes either side of the current route. */
    if ( Math.abs( index - routes.indexOf( route )) > 2 ) {
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

    children = React.Children.map( children, child => (
      React.cloneElement( child, {
        ...child.props,
        props: child.props.props && {
          ...child.props.props,
          ...onLayout,
        },
      })
    ));

    const sceneStyle = {
      ...height,
      ...sceneProps,
    };

    return (
      <Box
        flex={1}
        alignItems="center"
        justifyContent="center"
        {...sceneStyle}
      >
        {(
          children &&
          children.length > 0 &&
          children[route.key]
        ) ? (
            children[route.key]
          ) : (
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
    const { bottomTabs, height, width, paddingBottom } = this.props;
    const { index, routes } = this.state;
    const initialLayout = {
      height: 20,
      width: Dimensions.get( 'window' ).width,
    };

    const style = {
      height,
      width,
      paddingBottom: Number( paddingBottom ),
    };

    const navigationState = {
      index,
      routes,
    };

    return (
      <TabView
        style={style}
        navigationState={navigationState}
        renderScene={this.renderScene}
        renderTabBar={this.renderTabBar}
        onIndexChange={this.handleIndexChange}
        initialLayout={initialLayout}
        tabBarPosition={(
          bottomTabs
            ? 'bottom'
            : 'top'
        )}
      />
    );
  }
}

export default Tabs;
