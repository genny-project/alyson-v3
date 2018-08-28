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

- `component` - Sets the component that should be rendered. ([View a list of all the components](COMPONENTS.md))
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

## Conditional Display

Sometime it is important to show different content based on your data. For example if a user is logged out then you may want to hide or show different components on the page. We've got a number of different ways to handle this:

- `onlyShowIf`
- `dontShowIf`
- `conditional`

### onlyShowIf

The `onlyShowIf` functionality, as its name implies, allows you to only show a component inside a layout if certain critera are met. To best explain this, let's use the following example:

```json
{
  "component":"Text",
  "children": "Select a payment method",
  "props": {
    "color": "red"
  }
}
```

Lets say we wanted to hide this piece of text if a user had no payment methods for example. We'd change the above to the below (adding the `onlyShowIf` section.)

```json
{
  "component":"Text",
  "children": "Select a payment method",
  "props": {
    "color": "red"
  },
  "onlyShowIf": {
    "user.attributes.PRI_USER_PAYMENT_METHODS.value": {
      "$size": {
        "$gt": 0
      }
    }
  }
}
```

If you don't understand what we are doing with the `user.attributes.PRI_USER_PAYMENT_METHODS.value` section of the above then go have a read of the `Query` documentation (linked above). 

The `$size` and `$gt` (greater than) section of the `onlyShowIf` query are what we call "query operators". In the above example we are using two of them. The first is `$size` which returns the number of elements (in our case number of payment methods) and then we are checking whether that size is greater than 0 by using `$gt`.

Let's try a more simple example. Where we show "Hello John" if the users first name is "John" and their last name is "Smith"

```json
{
  "component":"Text",
  "children": "Hello John",
  "props": {
    "color": "blue"
  },
  "onlyShowIf": {
    "user.attributes.PRI_USER_FIRSTNAME.value": "John",
    "user.attributes.PRI_USER_LASTNAME.value": "Smith"
  }
}
```

`onlyShowIf` allows us to use a key:value syntax to specify the conditions on which this component will be displayed. Additionally you can use more advanced query operators to use more advanced conditions.

A list of "query operators" use can use is below. All of these query operators are directly based on the MongoDB way of querying (so if you get a bit stuck take a look at the documentation for each one there.)

- `$and`
  - Performs a logical AND operation on an array of two or more expressions. Allows you to specify multiple conditions that must be true.
  - `{ $and: [ { <expression1> }, { <expression2> } , ... , { <expressionN> } ] }`
  

