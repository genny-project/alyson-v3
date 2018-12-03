import React, { Component } from 'react';
import { number, func, string } from 'prop-types';
import range from 'lodash.range';
import { TouchableOpacity } from 'react-native';
import { Icon, Box } from '../../../components';

class InputRating extends Component {
  static defaultProps = {
    numberOfStars: 5,
    color: 'lightGrey',
    testID: 'input-rating',
  }

  static propTypes = {
    numberOfStars: number,
    value: number,
    onChange: func,
    color: string,
    testID: string,
  }

  handleOnPress = ( value ) => {
    if ( this.props.onChange ) this.props.onChange( value );
  }

  render() {
    const { numberOfStars, value, color, testID } = this.props;

    return (
      <Box
        flexDirection="row"
        testID={testID}
      >
        {range( numberOfStars )
        .map( i => (
          <TouchableOpacity
            key={i}
            onPress={() => this.handleOnPress( i + 1 )}
          >
            <Icon
              name={(
                value >= i + 1
                  ? 'star'
                  : 'star-border'
              )}
              color={color}
            />
          </TouchableOpacity>
        ))}
      </Box>
    );
  }
}

export default InputRating;
