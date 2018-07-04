import React from 'react';
import { bool, node, func, oneOfType } from 'prop-types';
import { Button } from '../../';
import Toggle from '../';

const ToggleButton = ({ isInitiallyToggled, children, ...restProps }) => (
  <Toggle isInitiallyToggled={isInitiallyToggled}>
    {({ isToggled, handleToggle }) => (
      isToggled ? (
        typeof children === 'function' ? (
          children( handleToggle )
        ) : (
          children
        )
      ) : (
        <Button
          onPress={handleToggle}
          {...restProps}
        />
      )
    )}
  </Toggle>
);

ToggleButton.propTypes = {
  isInitiallyToggled: bool,
  children: oneOfType(
    [node, func]
  ),
};

export default ToggleButton;
