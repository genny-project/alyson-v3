import React from 'react';
import { string, bool } from 'prop-types';
import { Input, Text, Box, Icon } from '../../index';

const InputWithLabel = ({
  label,
  error,
  valid,
  ...restProps
}) => {
  return (
    <Box
      alignItems="center"
      flexDirection="column"
      marginBottom={20}
    >
      <Box
        alignItems="center"
        marginBottom={5}
        justifyContent="space-between"
        width="100%"
      >
        <Text
          bold
          size="xs"
          color="grey"
        >
          {label}
        </Text>

        {error ? (
          <Icon
            name="close"
            color="red"
          />
        ) : valid ? (
          <Icon
            name="check"
            color="green"
          />
        ) : (
          <Icon
            name="check"
            color="lightgrey"
          />
        )}
      </Box>

      <Box>
        <Input {...restProps} />
      </Box>
    </Box>
  );
};

InputWithLabel.propTypes = {
  label: string,
  error: bool,
  valid: bool,
};

export default InputWithLabel;
