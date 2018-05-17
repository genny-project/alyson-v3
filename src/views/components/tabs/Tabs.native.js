import React, { Component } from 'react';
import { any, array, bool, string, number, oneOfType, func } from 'prop-types';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import { Dimensions } from 'react-native';
import { Box, Text, Icon } from '../../components';

const tabBarHeight = {
  sm: 40,
  md: 50,
  lg: 60,
};

class Tabs extends Component {
  static defaultProps = {
    tabs: [],
    height: '100%',
    width: '100%',
    tabBarSize: 'md',
    tabBarBackground: 'lightgray',
    activeTabBackground: 'darkgrey',
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

  handleIndexChange = index => this.setState({ index });

  handlePress = () => {
    if ( this.props.onPress ) this.props.onPress();
  }

  renderIcon = ({ route }) => {
    return route.icon ? <Icon name={route.icon} size="sm" color={this.props.iconColor} /> : null;
  }

  renderHeader = props => {   
    const { 
      tabBarSize,
      tabBarBackground,
      activeTabBackground,
      textColor,
    } = this.props;

    return ( 
      <TabBar 
        {...props}
        onTabPress={this.handlePress}
        style={{
          backgroundColor: tabBarBackground,
          flexBasis: tabBarHeight[tabBarSize],
        }}
        scrollEnabled
        renderIcon={this.renderIcon}
        tabStyle={{
          flexGrow: 1,
          alignItems: 'center',
        }}
        labelStyle={{
          color: textColor,
        }}
        indicatorStyle={{
          height: tabBarHeight[tabBarSize],
          backgroundColor: activeTabBackground,
        }}
      />
    );
  };

  renderScene = ({ route }) => {
    const { children } = this.props;

    return (
      <Box flex={1}>
        {(
          children &&
          children.length > 0 &&
          children[route.key]
        ) ? (
            children[route.key]
          ) : (
            <Text>
              No Items To Display
            </Text>
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

    return (
      <TabViewAnimated
        style={{ height: height, width: width }}
        navigationState={{ index, routes }}
        renderScene={this.renderScene}
        {...bottomTabs ? {
          renderFooter: this.renderHeader,
        } : {
          renderHeader: this.renderHeader,
        }}
        onIndexChange={this.handleIndexChange}
        initialLayout={initialLayout}
      />
    );
  }
}

export default Tabs;
