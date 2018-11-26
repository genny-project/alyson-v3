# Selectable

## Description

Component used with `Selection` to make an element trackable by the Selection component, and clickable.

Children can use the following property in the layout:

```
selectable: {
  isSelected: bool,
}
```

## Props

| Prop Name | Prop Type | Description |
| :-------- | :-------: | :---------- |
| selectionProps | object.isRequired | item props passed from Selection |
| id | string.isRequired | property used as a unique identifier for the component |
| item | any.isRequired | data being passed into the component |
