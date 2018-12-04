# Layouts
- [Overview](#overview)
- [Core Structure](#core-structure)
- [Example - Nested Components](#example---nested-components)
- [Query](#query)
- [The Context and Dynamic Data Display](#the-context-and-dynamic-data-display)
- [Repeater](#repeater)
- [Conditional Display](#conditional-display)
  - [Query operators](#query-operators)
  - [onlyShowIf](#onlyshowif)
  - [dontShowIf](#dontshowif)
  - [conditional](#conditional)
- [Testing](#testing)

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

You may have asked yourself "how do you handle the fetching / querying of data?". For that we use an array of query operators.
As this is a slight bit more detailed you can view the documentation below:

[Query Documentation](./DATA-QUERY.md)

## The Context and Dynamic Data Display

For displaying dynamic data inside our layouts we use a Handlebars inspired syntax. This allows us to include data from the "context" (details to follow) inside our layouts.

The context is a data object can contains a pool of data that you can use. The current context object contains the following information.

```json
{
  "query": "The results of any data query operations specified in this layout",
  "navigation": "Navigation / URL / Route parameters",
  "props": "If this layout is a sublayout (layout loaded from a layout) any props passed in are accessible here",
  "time": "An object which returns information about the current time, for example time of day (morning, evening etc)",
  "user": "An object containing information about the currently logged in user (if they exist)",
  "repeater": "If you are using the repeater functionality than this object will exist and include the data of the current item that is being repeated"
}
```

All of the data inside the context can be included anywhere in the layout using the handlebars syntax. For example `{{user.attributes.PRI_FIRSTNAME.value}}` would be replaced with `Bob`. A real life example layout with this in use is as follows:

```
{
  "component": "Text",
  "children": "{{user.attributes.PRI_FIRSTNAME.value}} {{user.attributes.PRI_LASTNAME.value}}",
}
```

This would display the users first name and last name.

You may have noticed that the `{{value}}` syntax will always return a string. Whilst this is okay in most cases, in some cases you may need to pass an object, number, boolean etc from the context. The way we do that is by the use of a underscore `_` syntax which passes the value directly.

Let's say that we've built a new component that displays a key value style object in a table and we want to use this new component to display all of the attributes for the user. If we used the handlebars syntax `{{user.attributes}}` we'd get a result of `[Object]` (this is what you get when you try and convert an object to a string). Using our underscore syntax we'd simply do the following `_user.attributes` which would pass the full value.

Let's take a look at an example of this.

```jsx
{
  "component": "Table",
  "props": {
    "data": "_user.attributes"
  }
}
```

This will pass the raw `user.attributes` object straight through as the `data` prop on `Table` as an object instead of a string.

## Repeater

Sometimes you'll want to repeat a component based on your data. This is handy for doing things like showing lists. To repeat a component based on specific data we set the `repeat` field as well as setting the child component that we need repeater. You'll notice that the **children object has been set to a single object instead of an array**. This required whenever using the repeater functionality.

For example, let's say we want to list a users payment methods inside a `Box`. 

```json
{
  "component": "Box",
  "repeat": "_user.attributes.PRI_PAYMENT_METHODS.value",
  "children": {
    "component": "Text",
    "children": "{{repeater.accountName}}"
  }
}
```

You'll see how we set `repeat` to equal `_user.attributes.PRI_PAYMENT_METHODS.value`. This means that it'll render the single child component for every single payment method that the user has. In this case we are rendering the account name for each account. The context for this component now includes a `repeater` object which contains the data for each single payment method. We can use this and the handlebars syntax to display the account name for each account.

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

## Query operators

A list of "query operators" use can use is below. All of these query operators are directly based on the MongoDB way of querying (so if you get a bit stuck take a look at the documentation for each one there.)

- `$and`
  - Performs a logical AND operation on an array of two or more expressions. Allows you to specify multiple conditions that must be true.
  - `{ $and: [ { <expression1> }, { <expression2> } , ... , { <expressionN> } ] }`

- `$eq`
  - Matches values that are equal to a specific value.
  - `{ <field>: { $eq: <value> } }`

- `$exists`
  - Matches documents that have the specified field.
  - `{ field: { $exists: <boolean> } }`

- `$gt`
  - Matches values that are greater than a specified value.
  - `{field: {$gt: value} }`

- `$gte`
  - Matches values that are greater than or equal to a specified value.
  - `{field: {$gte: value} }`

- `$in`
  - Matches any of the values specified in an array.
  - `{ field: { $in: [<value1>, <value2>, ... <valueN> ] } }`

- `$lt`
  - Matches values that are less than a specified value.
  - `{field: {$lt: value} }`

- `$lte`
  - Matches values that are less than or equal to a specified value.
  - `{ field: { $lte: value} }`

- `$mod`
  - Performs a modulo operation on the value of a field
  - `{ field: { $mod: [ divisor, remainder ] } }`

- `$ne`
  - Matches all values that are not equal to a specified value.
  - `{field: {$ne: value} }`

- `$nin`
  - Matches none of the values specified in an array.
  - `{ field: { $nin: [ <value1>, <value2> ... <valueN> ]} }`

- `$nor`
  - Performs a logicial NOR operator on an array of two or more expressions.
  - `{ $nor: [ { <expression1> }, { <expression2> }, ...  { <expressionN> } ] }`

- `$not`
  - Inverts the effect of a query expression.
  - `{ field: { $not: { <operator-expression> } } }`

- `$or`
  - Joins query clauses with a logical OR operation.
  - `{ $or: [ { <expression1> }, { <expression2> }, ... , { <expressionN> } ] }`

- `$regex`
  - Performs a regex match on a particular field
  - `{ <field>: { $regex: '/pattern/' } }`

- `$size`
  - Compares the size of the array located at a particular field
  - `{ field: { $size: 2 } }`


### dontShowIf

`dontShowIf` works in exactly the same way as onlyShowIf, however instead of showing a component based on particular criteria it hides components based on particular criteria. It is the same as using onlyShowIf and negating the condition/s.

### conditional

The `conditional` functionality allows you to set conditional props based on particular conditions. This allows you to easily do things like make text a different colour based on your data without having to duplicate the component and use the `onlyShowIf/dontShowIf` functionality.

A standard conditional object structure is as follows:

```json
{
  "if": {

  },
  "then": {

  },
  "else": {

  }
}
```

An full example of the above is as follows:

```json
{
  "component": "Text",
  "children": "You are great!",
  "conditional": {
    "if": {
      "user.attributes.PRI_AGE.value": {
        "$gt": 18,
        "$lt": 50
      }
    },
    "then": {
      "color": "green"
    },
    "else": {
      "color": "red"
    }
  }
}
```

If the value of `user.attributes.PRI_AGE.value` (the users age) is greater than 18 and less than 50 then the text will be green, otherwise it will be red. Nice and simple!

The full range of query operators as documented in the `onlyShowIf` section is available inside the `if` section of the conditional which allows for more complex conditional props.

Additionally there is also support for using an array of conditionals as follows:

```json
  "conditional": [
    {
      "if": {

      },
      "then": {
        
      }
    },
    {
      "if": {

      },
      "then": {
        
      }
    },
    {
      "if": {

      },
      "then": {
        
      }
    }
  ]
```

This allows individual props to have their own conditions.

## Testing
Testing layouts in V3 can be accomplished in a number of ways:
- Robot Framework
- Puppeteer
- Any other DOM tree based testing framework

The way we accomplish testing is through the use of the `testID` attribute. In web this attribute is mapped to the `data-testid` attribute on DOM elements. On a native device it can also be used to locate a particular view ([https://facebook.github.io/react-native/docs/view#testid](https://facebook.github.io/react-native/docs/view#testid)).

By default the majority of components have default testIDs (button, sidebar, header etc), however this isn't hugely useful for efficient testing. As we can use the layouts functionality to create our own components it is important to take the following steps to ensure that testing can be easily accomplished.

- Make sure that you have the testID prop set on any new components that are created.
- Make sure that you set the layout ID inside any layouts and sublayouts that you create (example below). This automatically sets a testID on the box that wraps that whole layout when rendered.
- Additionally making sure that you set the testID prop on any Box components inside your layouts where the box represents a section of UI. For example if you had two boxes inside a layout, 1 containing core user details and another containing contact infomation it would be important to set a testID on both reflecting the purpose.

### Setting a layout ID (Example)
```json
"layout": {
  "id":"my-special-layout"
},
"children": [],
"context": [],
```