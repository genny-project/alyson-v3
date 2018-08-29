# Icon

## Description

This component renders an icon.

It can use icons from four different sources: Material Icons, Feather, Font Awesome, and Materical Icons Community.

## Props

### All Platforms

```
name: string.isRequired,
color: string ('white'),
size: oneOf(
  ['xs', 'sm', 'md', 'lg', 'xl'] ('md')
),
```

### Native Only

```
type: oneOf(
  ['material-icons', 'feather', 'font-awesome', 'material-icons-community'] ('material-icons')
),
```