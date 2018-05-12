import React, { PureComponent } from 'react';
import { string, oneOfType, array, number, any, func } from 'prop-types';
import { Box, Text, Button } from '../../components';

class Tabs extends PureComponent {
  static defaultProps = {
    width: '100%',
    height: '100%',
    tabs: [
      {
        text: 'Tab 1',
        icon: 'email',
        id: 1,
      },
      {
        text: 'Tab 2',
        icon: 'photo',
        id: 2,
      },
      {
        text: 'Tab 3',
        icon: 'phone',
        id: 3,
      },
      {
        text: 'Tab 4',
        icon: 'phone',
        id: 4,
      },
    ],
  }

  static propTypes = {
    children: any,
    width: oneOfType(
      [string, number]
    ),
    height: oneOfType(
      [string, number]
    ),
    tabs: array,
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
      tabs,
    } = this.props;

    const {
      currentChild,
    } = this.state;

    return (
      <Box
        flexDirection='column'
        flex={1}
        height={height}
        width={width}
      >
        <Box
          justifyContent='flex-start'
          flex={0}
          backgroundColor='gray'
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
                backgroundColor={index === currentChild ? 'darkgray' : 'gray'}
              >
                <Button
                  onPress={() => this.handlePress( index )}
                  style={{ flexDirection: 'row' }}
                  icon={tab.icon}
                  textColor='white'
                >
                  {tab.text}
                </Button>
              </Box>
            ))
          ) : (
            <Text>No Items</Text>
          )}
        </Box>
        <Box
          padding={10}
          backgroundColor='darkgray'
        >
          {children[currentChild]}
        </Box>
      </Box>
    );
  }
}

export default Tabs;
