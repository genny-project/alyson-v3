# Sublayout

## Description

This component renders components from a separate layout file.

All other props that are defined where the Sublayout component is are passed to the layout being rendered.

## Example

`parent.json`
```
"component": "Sublayout",
"props": {
  "layoutName": "sublayout",
  "layoutID": "LAY1234"
}
```

In `sublayout.json`
```
{
  "component": "Text",
  "props": {
    "text": "{{props.layoutID}}"
  }
}
```

## Props

| Prop Name | Prop Type | Description |
| :-------- | :-------: | :---------- |
| layoutName | string | Name of the sublayout to be rendered |

