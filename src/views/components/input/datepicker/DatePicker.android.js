import React, { Component } from 'react';
import { string } from 'prop-types';
import { Box, Text } from '../../../components';

class DatePicker extends Component {  
  static defaultProps = {
    value: '',
  }

  static propTypes = {
    value: string,
  }

  render() {
    const { value } = this.props;

    return (
      <Box>
        <Text>
          DatePicker Android
          {value}
        </Text>
      </Box>
    );
  }
}

export default DatePicker;
