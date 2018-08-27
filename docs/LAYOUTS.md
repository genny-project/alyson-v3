# Layouts
## Overview

In the Genny Project architecture we define our views as "Layouts".
These layouts are created from JSON files, as apposed to the tradtional
model of writing them in code.

## Core Structure

The core of a layout JSON file is as follows

```json
{
  "layout": {
    "title":"Hello world",
    "appColor": "white",
    "backgroundColor": "#000"
  },
  "children": [
    {
      "component": "Text",
      "children": "Welcome to Layouts",
      "props": {
        "color": "white"
      }
    }
  ],
  "query": []
}
```

For those who are familiar with **React** this is similar to the following JSX:

```jsx
<Layout title="Hello world" appColor="white" backgroundColor="#000">
  <Text color="white">
    Welcome to Layouts
  </Text>
</Layout>
```

As a matter of fact, when the layout is parsed inside Alyson V3, pretty much
renders to the above.

Each layout must have a `layout` object and a `children` array. Inside the `layout` object you've got
the following options:

| Option | Type | Description |
| ------ | ---- | ----------- |
| title | String | The title of this layout. Gets displayed as the window title on Web. |
| appColor | String | The primary color of the application. This can be any CSS color code. |
| backgroundColor | String | The background color of this layout. This can be any CSS color code. |

The `children` array respresents the "components" / "component tree" that make up this layout.

Each "child" in the `children` array has the following basic structure.

```json
{
  "component": "Component Identifier / Name",
  "children": [],
  "props": {}
}
```

- `component` - Sets the component that should be rendered. ([View a list of all the components](../COMPONENTS.md))
- `children` - The child components of this component. Simply include an array of objects similar to above. You can nest as many times as you like! Alternatively you can also pass a string as the `children`.
- `props` - The properties or "props" for this component. The available options for this section are under the documentation for each component.

## Example - Nested Components

```json
{
  "layout": {
    "title":"Hello world",
    "appColor": "white",
    "backgroundColor": "#000"
  },
  "children": [
    {
      "component": "Box",
      "children": [{
        "component": "Text",
        "props": {
          "color": "red"
        },
        "children": "Hello world"
      }],
      "props": {
        "backgroundColor": "blue"
      }
    }
  ],
  "query": []
}
```

## Query

You may have asked yourself "how do you handle data?". For that we use an array of query operators.
As this is a slight bit more detailed you can view the documentation below:

[Query Documentation](./DATA-QUERY.md)