import React, { PureComponent } from 'react';
import { string, oneOfType, array, number, any, func, oneOf, object } from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { withRouter } from 'react-router-dom';
import dlv from 'dlv';
import { isArray, Bridge, getDeviceSize } from '../../../utils';
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
    testID: 'tabs',
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
    testID: string,
    parentRoute: string,
    history: object,
    location: object,
  }

  state = {
    currentChild: 0,
  }

  static getDerivedStateFromProps( props, state ) {
    const newState = { ...state };
    const hash = dlv( props, 'history.location.hash' );
    const newIndex = parseInt( hash.slice( 1 ), 10 );

    if ( newIndex && typeof newIndex === 'number' ) {
      if ( newIndex !== newState.currentChild ) {
        newState.currentChild = newIndex;
      }
    }

    return newState;
  }

  componentDidMount() {
    this.setInitialTab();
  }

  setInitialTab() {
    const { tabs, location } = this.props;

    if ( !isArray( tabs, { ofMinLength: 1 }))
      return;

    if ( location.hash ) {
      const hashIndex = parseInt( location.hash.slice( 1 ), 10 );

      if (
        Number.isInteger( hashIndex ) &&
        hashIndex < tabs.length
      ) {
        this.setState({ currentChild: hashIndex });
      }
    }
  }

  handlePress = ( index ) => {
    const routeObject = this.props.tabs.filter( x => x.key === index )[0];

    Bridge.sendEvent({
      event: 'BTN',
      eventType: 'ROUTE_CHANGE',
      sendWithToken: true,
      data: {
        code: `${this.props.parentRoute}${routeObject ? `/${routeObject.route}` : ''}`,
        value: routeObject ? `${routeObject.key}` : '',
      },
    });
    this.setState({ currentChild: index });
    if ( this.props.onPress ) this.props.onPress();

    const { location, replace } = this.props.history;

    replace( `${location.pathname}#${index}` );
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
      testID,
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
        testID={testID}
      >
        <Box
          {...tabWrapperProps}
          {...getDeviceSize() === 'sm'
            ? {
              width: '100%',
              overflowX: 'auto',
            }
            : {}
          }
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
                  style={{ flexDirection: 'row', flex: 1 }}
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
          {...getDeviceSize() === 'sm'
            ? {
              width: '100%',
              overflowX: 'hidden',
            }
            : {}
          }
          {...childProps}
        >
          { isArray( children, { ofMinLength: 1 })
            ? children[currentChild]
            : null
          }
        </Box>
      </Box>
    );
  }
}

export default withRouter( Tabs );
