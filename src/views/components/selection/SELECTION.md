# Selection

## Description

Component that keeps track of a group of selectable items and which item is currently selected.

Can used two ways:

1) Standalone, in which all of its child elements are passed props to trigger
selection changes and apply styling to selected elements.

Children can use the following properties in the layout:

```
selection: {
  onSelect: func,
  isSelected: bool,
}
```

2) Alongside Selectable, where specific child elements are wrapped in the Selectable component
which tracks handles the press events and passes selected props.

Children can use the following properties in the layout:
Children can use the following variables in the layout:

```
selection: {
  onSelect: func,
  selectedItem: string,
}
```

## Props

| Prop Name | Prop Type | Description |
| :-------- | :-------: | :---------- |
| mode | oneOf( ['single','toggle'] ) | Determines whether the an itemmust always be selected, or if items can be toggles on/off |
| selectFirstItemOnMount | bool | Should an item be automatically selected when component is rendered. |
| dispatchActionOnChange | shape({ type: string.isRequired, payload: any }) | State change action to be sent to the store if specified. |
| onChange | func | Function can be called when state changes |
| useSelectableComponents | bool | Should the component operator standlone or alongside Selectable. |
