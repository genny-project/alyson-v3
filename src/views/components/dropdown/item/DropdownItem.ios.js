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
  borderBottomColor,
}) => {
  const element = (
    <Box
      justifyContent="space-between"
      alignItems="center"
      padding={20}
      width="100%"
      borderBottomColor={borderBottomColor}
      borderBottomStyle="solid"
      borderBottomWidth={2}
    >
      <Text
        color={textColor}
        bold
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
  borderBottomColor: string,
};

export default DropdownItem;
