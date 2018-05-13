import React, { PureComponent } from 'react';
import { string, oneOfType, array, number, any, func, oneOf } from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { Icon, Box, Text } from '../../components';

const tabBarHeight = {
  sm: 30,
  md: 50,
  lg: 70,
};

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
    width: '100%',
    height: '100%',
    padding: 0,
    tabs: [
    ],
    tabBarSize: 'md',
    tabBarBackground: 'lightgray',
    activeTabBackground: 'darkgrey',
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
    tabBackground: string,
    activeTabBackground: string,
    tabBarSize: string, 
    textColor: string,
    tabBarSide: oneOf(
      ['top', 'bottom', 'left', 'right']
    ),
    onPress: func,
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
      tabBarSize,
      textColor,
      tabBarSide,
    } = this.props;

    const {
      currentChild,
    } = this.state;

    return (
      <Box
        flexDirection={tabBarLocation[tabBarSide]}
        flex={1}
        height={height}
        width={width}
      >
        <Box
          flexDirection={tabBarDirection[tabBarSide]}
          flex={0}
          height={
            tabBarSide === 'top' ||
            tabBarSide === 'bottom' ? 
              tabBarHeight[tabBarSize] :
              null
          }
          backgroundColor={tabBarBackground}
        >
          {(
            tabs &&
            tabs instanceof Array &&
            tabs.length > 0
          ) ? (
              tabs.map(( tab, index ) => (
                <Box
                  key={tab.id}
                  padding={10}
                  height={tabBarHeight[tabBarSize] || null}
                  backgroundColor={index === currentChild ? activeTabBackground : tabBackground}
                >
                  <TouchableOpacity
                    onPress={() => this.handlePress( index )}
                    style={{ flexDirection: 'row' }}
                    height={tabBarHeight[tabBarSize] || null}
                  >
                    {
                      tab.icon ?
                        ( 
                          <Icon
                            name={tab.icon}
                          />
                        ) :
                        null
                    }
                    <Text
                      color={textColor}
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
        >
          {children[currentChild]}
        </Box>
      </Box>
    );
  }
}

export default Tabs;
