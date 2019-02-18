import React from 'react';
import { View, Platform } from 'react-native';
import { any, oneOf, oneOfType, string, number, array, func, bool, object, shape } from 'prop-types';

/** Ensure the props we're going to use were indeed passed through. */
function filterOutUnspecifiedProps( props ) {
  const keys = Object.keys( props );

  return keys.reduce(( filteredProps, prop ) => {
    if ( props[prop] != null )
      filteredProps[prop] = props[prop];

    return filteredProps;
  }, {});
}

function Box({
  children,
  justifyContent,
  alignItems,
  height,
  minHeight,
  maxHeight,
  width,
  minWidth,
  maxWidth,
  flex,
  flexBasis,
  flexGrow,
  flexShrink,
  flexDirection = 'row',
  flexWrap,
  padding,
  paddingTop,
  paddingRight,
  paddingLeft,
  paddingBottom,
  paddingX,
  paddingY,
  margin,
  marginX,
  marginY,
  marginTop,
  marginRight,
  marginLeft,
  marginBottom,
  backgroundColor,
  position = 'initial',
  top,
  right,
  bottom,
  left,
  zIndex = 'auto',
  transform,
  transitionDuration,
  transitionProperty,
  transitionTimingFunction,
  transitionDelay,
  opacity,
  accessible,
  accessibilityRole,
  accessibilityLabel,
  borderTopWidth,
  borderRightWidth,
  borderBottomWidth,
  borderLeftWidth,
  borderWidth,
  borderColor,
  borderStyle,
  borderRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomRightRadius,
  borderBottomLeftRadius,
  shadowColor,
  shadowOpacity,
  shadowRadius,
  shadowOffset,
  fullHeightOnWeb,
  __dangerouslySetStyle = {},
  overflow,
  overflowX,
  overflowY,
  display = 'flex',
  overscrollBehavior,
  overscrollBehaviorX,
  overscrollBehaviorY,
  onLayout,
  ...restProps
}) {
  const boxStyle = filterOutUnspecifiedProps({
    padding,
    paddingTop,
    paddingRight,
    paddingLeft,
    paddingBottom,
    paddingHorizontal: paddingX,
    paddingVertical: paddingY,
    margin,
    marginHorizontal: marginX,
    marginVertical: marginY,
    marginTop,
    marginRight,
    marginLeft,
    marginBottom,
    borderTopWidth,
    borderRightWidth,
    borderBottomWidth,
    borderLeftWidth,
    borderWidth,
    display,
    shadowColor,
    shadowOpacity,
    shadowRadius,
    shadowOffset,
    justifyContent,
    alignItems,
    height: Platform.OS === 'web' && fullHeightOnWeb ? '100vh' : height,
    minHeight,
    maxHeight,
    width,
    minWidth,
    maxWidth,
    flex,
    flexBasis,
    flexGrow,
    flexShrink,
    flexDirection,
    flexWrap,
    backgroundColor,
    position: (
      (
        position === 'sticky' &&
        Platform.OS !== 'web'
      )
        ? 'relative'
        : position
    ),
    top,
    right,
    bottom,
    left,
    zIndex,
    transform,
    opacity,
    borderColor,
    borderStyle,
    borderRadius,
    borderBottomRightRadius,
    borderBottomLeftRadius,
    borderTopRightRadius,
    borderTopLeftRadius,
    overflow,
    overflowX,
    overflowY,
    overscrollBehavior,
    overscrollBehaviorX,
    overscrollBehaviorY,
    ...__dangerouslySetStyle,
  });

  const webStyle = Platform.OS !== 'web' ? {} : filterOutUnspecifiedProps({
    accessibilityRole,
    overflow,
    overflowX,
    overflowY,
    transitionDuration,
    transitionProperty,
    transitionTimingFunction,
    transitionDelay,
  });

  return (
    <View
      {...restProps}
      accessible={accessible}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      style={[
        boxStyle,
        webStyle,
      ]}
      onLayout={onLayout}
    >
      {children}
    </View>
  );
}

Box.propTypes = {
  children: any,
  justifyContent: oneOf(
    ['flex-start', 'flex-end', 'center', 'space-between', 'space-around']
  ),
  alignItems: oneOf(
    ['flex-start', 'flex-end', 'center', 'space-between', 'space-around']
  ),
  height: oneOfType(
    [string, number]
  ),
  minHeight: oneOfType(
    [string, number]
  ),
  maxHeight: oneOfType(
    [string, number]
  ),
  width: oneOfType(
    [string, number]
  ),
  minWidth: oneOfType(
    [string, number]
  ),
  maxWidth: oneOfType(
    [string, number]
  ),
  flexDirection: oneOf(
    ['row', 'row-reverse', 'column', 'column-reverse']
  ),
  flexWrap: oneOf(
    ['nowrap', 'wrap', 'wrap-reverse']
  ),
  flex: number,
  flexBasis: oneOfType(
    [string, number]
  ),
  flexGrow: number,
  flexShrink: number,
  padding: number,
  paddingTop: number,
  paddingRight: number,
  paddingLeft: number,
  paddingBottom: number,
  paddingX: number,
  paddingY: number,
  margin: number,
  marginX: number,
  marginY: number,
  marginTop: number,
  marginRight: number,
  marginBottom: number,
  marginLeft: number,
  backgroundColor: string,
  position: oneOf(
    ['fixed', 'absolute', 'relative', 'static', 'sticky']
  ),
  top: oneOfType(
    [number, string]
  ),
  right: oneOfType(
    [number, string]
  ),
  bottom: number,
  left: oneOfType(
    [number, string]
  ),
  zIndex: number,
  transform: array,
  transitionDuration: string,
  transitionProperty: string,
  transitionTimingFunction: string,
  transitionDelay: string,
  opacity: number,
  onLayout: func,
  onPress: func,
  accessible: bool,
  accessibilityRole: string,
  accessibilityLabel: string,
  borderTopWidth: number,
  borderRightWidth: number,
  borderBottomWidth: number,
  borderLeftWidth: number,
  borderWidth: number,
  borderColor: string,
  borderStyle: string,
  borderRadius: oneOfType(
    [number, string]
  ),
  borderTopLeftRadius: oneOfType(
    [number, string]
  ),
  borderTopRightRadius: oneOfType(
    [number, string]
  ),
  borderBottomRightRadius: oneOfType(
    [number, string]
  ),
  borderBottomLeftRadius: oneOfType(
    [number, string]
  ),
  cleanStyleObject: bool,
  fullHeightOnWeb: bool,
  __dangerouslySetStyle: object,
  overflow: string,
  overflowX: string,
  overflowY: string,
  display: string,
  overscrollBehavior: oneOf(
    ['auto', 'contain', 'none']
  ),
  overscrollBehaviorX: oneOf(
    ['auto', 'contain', 'none']
  ),
  overscrollBehaviorY: oneOf(
    ['auto', 'contain', 'none']
  ),
  shadowColor: string,
  shadowOpacity: oneOfType(
    [string, number]
  ),
  shadowRadius: oneOfType(
    [string, number]
  ),
  shadowOffset: shape({
    width: oneOfType(
      [string, number]
    ),
    height: oneOfType(
      [string, number]
    ),
  }),
};

export default Box;
