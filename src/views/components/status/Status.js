import React from 'react';
import { oneOf, string, number, oneOfType, bool } from 'prop-types';
import { Box, Text, Icon } from '../../components';

// const statusColor = {
//   warning: '#FFCC00',
//   info: '#03A9F4',
//   success: '#5cb85c',
//   error: '#cc0000',
//   disabled: '#808080',
// };

const Status = ({
  color = '#5cb85c',
  text,
  width = 10,
  height = 10,
  icon,
  iconColor = 'black',
  roundCorners = true,
}) => (
  <Box
    backgroundColor={color}
    height={height}
    width={width}
    justifyContent="center"
    alignItems="center"
    borderRadius={roundCorners ? 5 : 0}
  >
    {(
      text &&
      typeof text === 'string' &&
      text.length > 0
    ) ? (
      <Text>
        {text}
      </Text>
      ) : (
        icon &&
      typeof icon === 'string' &&
      icon.length > 0
      ) ? (
        <Icon
          name={icon}
          color={iconColor}
        />
        ) : null}
  </Box>
);

Status.propTypes = {
  color: oneOf(
    ['error','warning','success','info', 'disabled']
  ),
  width: oneOfType(
    [number, string]
  ),
  height: oneOfType(
    [number, string]
  ),
  text: string,
  icon: string,
  iconColor: string,
  roundCorners: bool,
};

export default Status;
