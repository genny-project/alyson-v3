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



### Web Only not fianlised yet

```sh
controls: false,
zoom: 12,
center: { lat: -33.8688, lng: 151.2093 },
markers: [{ lat: -33.8688, lng: 151.2093 }],
routes: [],
icon: 'https://i.imgur.com/unMXE8B.png',
iconClick: 'https://i.imgur.com/XiZYxed.png',
mapRouteIcon: 'https://i.imgur.com/Zyinht5.png',
suppressMarkers: true,
polygons: [],
polylines: [],
height: 300,
width: 400,
```