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

        <Box
          alignItems="center"
        >
          {restProps.required && (
            <Text
              color="grey"
              size="xs"
            >
              required
              {' '}
            </Text>
          )}

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
      </Box>

      <Box>
        <Input {...restProps} />
      </Box>

      {error ? (
        <Box
          paddingY={10}
          width="100%"
          justifyContent="flex-start"
        >
          <Text
            color="red"
            bold
            align="left"
            size="xs"
          >
            {error}
          </Text>
        </Box>
      ) : null}
    </Box>
  );
};

InputWithLabel.propTypes = {
  label: string,
  error: bool,
  valid: bool,
};

export default InputWithLabel;
