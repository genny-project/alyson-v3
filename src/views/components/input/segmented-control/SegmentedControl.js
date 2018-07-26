import React, { Component } from 'react';
import { array, func } from 'prop-types';
import { isArray } from '../../../../utils';
import { Box, Text, Touchable } from '../../index';

class Checkbox extends Component {
  static defaultProps = {
    value: [],
  }

  static propTypes = {
    items: array,
    value: array,
    onChangeValue: func,
  }

  static getDerivedStateFromProps( nextProps, nextState ) {
    if (
      nextProps.value != null &&
      nextProps.value !== nextState.selected
    ) {
      return { selected: nextProps.value };
    }

    return null;
  }

  state = {
    selected: this.props.value,
  }

  handlePress = value => () => {
    this.setState( state => {
      if ( state.selected.includes( value )) {
        return;
      }

      return { 
        selected: [value],
      };
    }, () => {
      if ( this.props.onChangeValue ) {
        this.props.onChangeValue( this.state.selected );
      }
    });
  }

  render() {
    const { items } = this.props;
    const { selected } = this.state;
  
    return (
      <Box
        flexDirection="row"
        width="100%"
      >
        {
          isArray( items, { ofMinLength: 1 }) ? (
            items.map(( item, index ) => {
              const borderCorners = {
                borderTopLeftRadius: index === 0 ? 10 : 0,
                borderTopRightRadius: index === items.length ? 10 : 0,
                borderBottomRightRadius: index === items.length ? 10 : 0,
                borderBottomLeftRadius: index === 0 ? 10 : 0,
              };

              return (
                <Touchable
                  key={item.value}
                  onPress={this.handlePress( item.value )}
                >
                  <Box
                    alignItems="center"
                    justifyContent="center"
                    flex={1}
                    padding={20}
                    backgroundColor={selected.includes( item.value )
                      ? '#202532'
                      : 'white'
                    }
                    {...borderCorners}
                  >
                    <Text
                      size="sm"
                      color={selected.includes( item.value )
                        ? 'white'
                        : '#202532'
                      }
                    >
                      {item.label}
                    </Text>
                  </Box>
                </Touchable>
              );
            })
          ) : (
            <Text>
              No items to show
            </Text>
          )}
      </Box>
    );
  }
}

export default Checkbox;
