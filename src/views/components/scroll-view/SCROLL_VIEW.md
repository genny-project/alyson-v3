# Scroll View

## Description

This component renders a view that is scrollable.

## Props

```
flex: number,
height: oneOfType(
  [string, number]
),
width: oneOfType(
  [string, number]
),
maxHeight: oneOfType(
  [string, number]
),
minHeight: oneOfType(
  [string, number]
),
horizontal: bool,
scrollEnabled: bool,
onScroll: func,
scrollEventThrottle: number,
onContentSizeChange: func,
keyboardDismissMode: oneOf(
  ['none', 'on-drag', 'interactive']
),
backgroundColor: string,
children: any,
onRefresh: func,
refreshControlElement: any,
enableRefresh: bool,
isRefreshing: bool,
padding: number,
paddingX: number,
paddingY: number,
onLayout: func,
```