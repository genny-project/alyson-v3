import React from 'react';
import { oneOf, string } from 'prop-types';
import { Box, Text, Icon } from '../../components';

const statusColor = {
  warning : '#FFCC00',
  info : '#03A9F4',
  success : '#5cb85c',
  error : '#cc0000',
  disabled : '#808080',
};

const Status = ({
  color = 'success',
  text,
  width = 10,
  height = 10,
  iconName,
  iconColor = 'black',
}) => {
  return (
    <Box
      backgroundColor={statusColor[color]}
      height={height}
      width={width}
      justifyContent='center'
      alignItems='center'
    >
      {( text &&
        text.length > 0
      ) ? (
        <Text>
          {text}
        </Text>
      ) : (
        iconName
      ) ? (
        <Icon
          name={iconName}
          color={iconColor}
        />
      ) :
        null
      }
    </Box>
  );
};

Status.propTypes = {
  color : oneOf(
    ['error','warning','success','info', 'disabled']
  ),
  width : string,
  height : string,
  text : string,
  iconName : string,
  iconColor : string,
};

export default Status;
