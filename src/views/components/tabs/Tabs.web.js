import React, { PureComponent } from 'react';
import { string, oneOfType, array, number, any, func, oneOf, object } from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { isArray } from '../../../utils';
import { Icon, Box, Text } from '../../components';

const tabBarLocation = {
  top: 'column',
  bottom: 'column-reverse',
  left: 'row',
  right: 'row-reverse',
};

const tabBarDirection = {
  top: 'row',
  bottom: 'row',
  left: 'column',
  right: 'column',
};

class Tabs extends PureComponent {
  static defaultProps = {
    padding: 0,
    tabs: [
    ],
    tabBarSize: 'md',
    tabBarBackground: 'lightgray',
    activeTabBackground: 'darkgrey',
    activeTabTextColor: 'white',
    textColor: 'white',
    tabBarSide: 'top',
  }

  static propTypes = {
    children: any,
    tabs: array,
    padding: number,
    width: oneOfType(
      [string, number]
    ),
    height: oneOfType(
      [string, number]
    ),
    tabBarBackground: string,
    activeTabTextColor: string,
    tabBackground: string,
    activeTabBackground: string,
    tabBarSize: string,
    textColor: string,
    tabBarSide: oneOf(
      ['top', 'bottom', 'left', 'right']
    ),
    onPress: func,
    tabProps: object,
    activeTabProps: object,
    inactiveTabProps: object,
    tabWrapperProps: object,
    tabTitleProps: object,
    tabIconProps: object,
    activeTabTitleProps: object,
    inactiveTabTitleProps: object,
    activeTabIconProps: object,
    inactiveTabIconProps: object,
    childProps: object,
  }

  state = {
    currentChild: 0,
  }

  handlePress = ( index ) => {
    this.setState({ currentChild: index });
    if ( this.props.onPress ) this.props.onPress();
  }

  render() {
    const {
      children,
      width,
      height,
      padding,
      tabs,
      tabBarBackground,
      tabBackground,
      activeTabBackground,
      activeTabTextColor,
      textColor,
      tabBarSide,
      tabProps,
      inactiveTabProps,
      activeTabProps,
      tabWrapperProps,
      tabTitleProps,
      activeTabTitleProps,
      inactiveTabTitleProps,
      activeTabIconProps,
      inactiveTabIconProps,
      tabIconProps,
      childProps,
      ...restProps
    } = this.props;

    const {
      currentChild,
    } = this.state;

    return (
      <Box
        {...restProps}
        flexDirection={tabBarLocation[tabBarSide]}
        flex={1}
        height={height}
        width={width}
      >
        <Box
          {...tabWrapperProps}
          flexDirection={tabBarDirection[tabBarSide]}
          flex={0}
          backgroundColor={tabBarBackground}
        >
          {isArray( tabs, { ofMinLength: 1 }) ? (
            tabs.map(( tab, index ) => (
              <Box
                key={tab.id}
                padding={10}
                backgroundColor={index === currentChild ? activeTabBackground : tabBackground}
                {...tabProps}
                {...index === currentChild ? activeTabProps : inactiveTabProps}
              >
                <TouchableOpacity
                  onPress={() => this.handlePress( index )}
                  style={{ flexDirection: 'row' }}
                >
                  {tab.icon ? (
                    <Icon
                      {...tabIconProps}
                      {...index === currentChild ? activeTabIconProps : inactiveTabIconProps}
                      name={tab.icon}
                      color={index === currentChild ? activeTabTextColor : textColor}
                    />
                  ) : null}

                  <Text
                    {...tabTitleProps}
                    {...index === currentChild ? activeTabTitleProps : inactiveTabTitleProps}
                    color={index === currentChild ? activeTabTextColor : textColor}
                  >
                    {tab.title}
                  </Text>
                </TouchableOpacity>
              </Box>
            ))
          ) : (
            <Text>
              No Items
            </Text>
          )}
        </Box>

        <Box
          padding={padding}
          flex={1}
          backgroundColor={activeTabBackground}
          {...childProps}
        >
          {children[currentChild]}
        </Box>
      </Box>
    );
  }
}

export default Tabs;
