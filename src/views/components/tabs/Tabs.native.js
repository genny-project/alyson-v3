import React, { Component } from 'react';
import { any, array, bool } from 'prop-types';
import { Box, Text, Icon } from '../../components';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import { Dimensions, StyleSheet } from 'react-native';

const initialLayout = {
  height: 20,
  width: Dimensions.get( 'window' ).width,
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: 'darkgray',
    // height: 100,
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 100,
  },
});

class TabViewExample extends Component {
  static defaultProps = {
    tabs: [
      { key: 0, title: 'Tab 1', icon: 'email' },
      { key: 1, title: 'Tab 2', icon: 'photo' },
    ],
    bottomTabs: false,
  }

  static propTypes = {
    children: any,
    tabs: array,
    bottomTabs: bool,
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

  renderIcon = ({ route }) => {
    return <Icon name={route.icon} />;
  }

  renderHeader = props => {   
    return ( 
      <TabBar 
        {...props} 
        style={style.tabBar}
        scrollEnabled
        renderIcon={this.renderIcon}
      />
    );
  };

  renderScene = ({ route }) => {
    const { children } = this.props;
    return (
      <Box flex={1} >
        {(
          children &&
          children.length > 0
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
    const { bottomTabs } = this.props;

    return (
      <TabViewAnimated
        style={style.container}
        navigationState={this.state}
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

export default TabViewExample;
