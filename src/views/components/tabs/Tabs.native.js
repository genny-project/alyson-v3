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
    activeLabelColor: string,
    activeIconColor: string,
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
  }

  handleIndexChange = index => {
    this.setState({ index });
  }

  handlePress = () => {
    if ( this.props.onPress )
      this.props.onPress();
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
      minHeight = 50,
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
          transform="upperCase"
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
    } = this.props;

    const style = {
      backgroundColor: tabBarBackground,
    };

    const indicatorStyle = {
      height: '100%',
      backgroundColor: activeTabBackground,
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
    const { children } = this.props;

    /* Only render the scene if it's within 2 routes either side of the current route. */
    if ( Math.abs( this.state.index - this.state.routes.indexOf( route )) > 2 ) {
      return <Box />;
    }

    return (
      <Box
        flex={1}
        alignItems="center"
        justifyContent="center"
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
    const { bottomTabs, height, width } = this.props;
    const { index, routes } = this.state;

    const initialLayout = {
      height: 20,
      width: Dimensions.get( 'window' ).width,
    };

    const style = {
      height,
      width,
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
