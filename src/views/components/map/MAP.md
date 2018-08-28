# Map

## Description

This component renders a Google Map with markers and directions.

Currently not implemented for Web.

## Props

### Native Only

```
markers: arrayOf(
  shape({
    latitude: oneOfType( [number, string] ),
    longitude: oneOfType( [number, string] ),
  })
),
showDirections: bool,
```