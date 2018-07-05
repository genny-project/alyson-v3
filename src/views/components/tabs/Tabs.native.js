import React, { Component, Fragment } from 'react';
import { ActivityIndicator, Dimensions } from 'react-native';
import { any, array, bool, string, number, oneOfType, func } from 'prop-types';
import { TabView, TabBar } from 'react-native-tab-view';
import { Box, Text, Icon, Timeout } from '../../components';

class Tabs extends Component {
  static defaultProps = {
    tabs: [],
    height: '100%',
    width: '100%',
    tabBarSize: 'md',
    tabBarBackground: '#3f3f3f',
    activeTabBackground: '#232323',
    iconColor: 'white',
    textColor: 'white',
    bottomTabs: false,
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
    textColor: string,
    bottomTabs: bool,
    onPress: func,
    scrollEnabled: bool,
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
  };

  handleIndexChange = index => {
    this.setState({ index });
  }

  handlePress = () => {
    if ( this.props.onPress )
      this.props.onPress();
  }

  renderIcon = ({ route }) => {
    return route.icon
      ? (
        <Icon
          name={route.icon}
          size="sm"
          color={this.props.iconColor}
        />
      )
      : null;
  }

  renderTabBar = props => {
    const {
      tabBarBackground,
      activeTabBackground,
      textColor,
      scrollEnabled,
    } = this.props;

    const style = {
      backgroundColor: tabBarBackground,
    };

    const labelStyle = {
      color: textColor,
      textAlign: 'center',
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
        renderIcon={this.renderIcon}
        style={style}
        labelStyle={labelStyle}
        indicatorStyle={indicatorStyle}
      />
    );
  };

  renderScene = ({ route }) => {
    const { children } = this.props;

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
