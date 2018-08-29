# Text

## Description

This component renders text.

## Props

```
text: string,
color: string ('black'),
decoration: oneOf(
  ['none']
),
fontWeight: string,
size: string ('sm'),
height: oneOfType(
  [number, string]
),
children: oneOfType(
  [number, string]
),
align: oneOf(
  ['auto', 'left', 'right', 'center', 'justify']
),
width: oneOfType(
  [number, string]
),
bold: bool (**Overrides fontWeight**),
fontFamily: string (web: system-ui, sans-serif', native: 'System') ,
transform: oneOf(
  ['upperCase', 'lowerCase', 'capitalize']
),
```