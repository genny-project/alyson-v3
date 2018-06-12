import React from 'react';
import { TouchableOpacity } from 'react-native';
import { string, func } from 'prop-types';
import { Box, Text, Icon, Link } from '../../../components';

const DropdownItem = ({
  href,
  onPress,
  text,
  icon,
  textColor = 'black',
}) => {
  const element = (
    <Box
      justifyContent="space-between"
      alignItems="center"
      padding={20}
    >
      <Text
        color={textColor}
      >
        {text}
      </Text>

      {icon && (
        <Icon
          name={icon}
          color={textColor}
        />
      )}
    </Box>
  );

  if ( href ) {
    return (
      <Link
        to={href}
        onPress={onPress}
      >
        {element}
      </Link>
    );
  }

  return (
    <TouchableOpacity onPress={onPress}>
      {element}
    </TouchableOpacity>
  );
};

DropdownItem.propTypes = {
  href: string,
  onPress: func,
  text: string,
  icon: string,
  textColor: string,
};

export default DropdownItem;
