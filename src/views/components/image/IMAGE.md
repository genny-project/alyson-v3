# Image

## Description

This component renders an image.

## Props

### All Platforms

```
width: oneOfType(
  [string, number]
),
height: oneOfType(
  [string, number]
),
source: string,
children: any,
shape: oneOf(
  ['square', 'rounded', 'circle']
),
```

### Native Only

```
minWidth: oneOfType(
  [string, number]
),
minHeight: oneOfType(
  [string, number]
),
maxWidth: oneOfType(
  [string, number]
),
maxHeight: oneOfType(
  [string, number]
),
fullscreen: bool,
fallbackIcon: string,
fallbackIconSize: string,
fallbackColor: string,
flex: number,
```