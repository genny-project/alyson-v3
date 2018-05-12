import React from 'react';
import { oneOf, string, number, oneOfType } from 'prop-types';
import { Box, Text, Icon } from '../../components';

const statusColor = {
  warning: '#FFCC00',
  info: '#03A9F4',
  success: '#5cb85c',
  error: '#cc0000',
  disabled: '#808080',
};

const Status = ({
  color = 'success',
  text,
  width = 10,
  height = 10,
  icon,
  iconColor = 'black',
}) => (
  <Box
    backgroundColor={statusColor[color]}
    height={height}
    width={width}
    justifyContent="center"
    alignItems="center"
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
};

export default Status;
