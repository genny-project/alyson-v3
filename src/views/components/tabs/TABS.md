# Tabs

## Description

This component renders a bar of buttons that can be used to switch the content of a single view.

Currently not fully implemented on web.

## Props

### All Platforms

```
children: any,
tabs: array,
width: oneOfType(
  [string, number] ('100%')
),
height: oneOfType(
  [string, number] ('100%')
),
tabBarBackground: string,
tabBackground: string,
activeTabBackground: string,
tabBarSize: string,
  ['top', 'bottom', 'left', 'right']
),
```

### Web Only

```
padding: number,
textColor: string,
tabBarSide: oneOf(
  ['top', 'bottom', 'left', 'right']
),
onPress: func,
```

### Native Only

```
iconColor: string,
labelColor: string,
bottomTabs: bool,
onPress: func,
scrollEnabled: bool,
iconSize: string,
iconProps: object,
labelProps: object,
indicatorProps: object,
sceneProps: object,
activeLabelColor: string,
activeIconColor: string,
restrictSceneHeights: bool,
paddingBottom: number,
```