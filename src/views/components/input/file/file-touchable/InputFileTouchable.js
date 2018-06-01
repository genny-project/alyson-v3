import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { Box, Text, Icon } from '../../../../components';

class InputFileTouchable extends Component {
  static defaultProps = {
    text: 'Upload a file',
  }

  static propTypes = {
    text: string,
    onPress: func,
  }

  state = {
  }

  render() {
    const {
      text,
      onPress,
    } = this.props;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={{ width: '100%' }}
      >
        <Box
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="center"
          padding={10}
          width="100%"
          borderStyle="solid"
          borderColor="lightgrey"
          borderWidth={2}
        > 
          <Box
            marginRight={10}
          >
            <Icon
              name="add-circle"
              color="grey"
            />
          </Box>
          <Text> 
            {text}
          </Text>
        </Box>
      </TouchableOpacity>
    );
  }
}

export default InputFileTouchable;
