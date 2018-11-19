# Data Query

The Alyson V3 supports an aggregation pipeline style approach to querying data.

## Adding a data query to a layout
Adding a data query to a layout is simple. Simply add the following:

```json
query: []
```

## How do data queries work
To best understand how data queries work think of an assembly line.

At the start of the line we have a box containing all of our data (or to be more precise, all of the Redux store).

This big box of data moves down the assembly line and is processed by a number of operators, one by one, each modifying the contents of the box of data by adding and removing things until we reach the end of the assembly line with the data formatted, sorted, filtered etc exactly how we want it.

The "end product" or "end data" we get after processing it through all of these operators is what is now available to our layout (as part of the context).

## Writing a basic data query
Now that we've covered the basics behind how data queries work let's write a simple one.

For example let's say we have got the code for a base entity (let's say it's a user / person) and we want to get all of the associated attributes to display as part of a user profile.

The best way to design your query is to think about it as individual operations. So let's do that and list them out in plain old text before writing anything proper.

1. Fetch the base entity with the provided code
2. Get all of the attributes for this base entity

This one is a nice and easy one that should only take 2 steps but some are harder than others.

Now that we've figured out exactly what our query is going to do let's write it out step by step.

Before we start on our query let's quickly outline what a "empty" query returns just so we can see how it changes. Here is an example of a empty query result (before any operators are added).

```json
{
  "baseEntities": {...},
  "attributes": {...}
}
```

Our first step is `Fetch the base entity with the provided code`. Let's say the code we have been given is `PER_AWESOME_DUDE`. We want to get the base entity associated with this code so we need to use the operator that does this (there is a big list below). In this case it is `getBe`. `getBe` needs to provided an `id` (which tells it the code of the base entity we are grabbing) and an `as` parameter which tells it where to store the base entity (if it exists). Let's add this operator to our query array we created earlier.

```json
{
  "query": [
    {
      "operator": "getBE",
      "id": "PER_AWESOME_DUDE",
      "as": "awesomeDude"
    }
  ]
}
```

The result of our query would now look something like this (with lots more data of course):

```json
{
  "baseEntities": {...},
  "attributes": {...},
  "awesomeDude": {
    "code": "PER_AWESOME_DUDE",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

Notice how we now have a key named "awesomeDude" containing the base entity data? First half of our query is done.

Our second (and final) step is to get all of the attributes for this base entity (as we don't have them yet in our `awesomeDude` object). Let's use the `populateBEGAttributes` operator to make this happen.

```json
{
  "query": [
    {
      "operator": "getBE",
      "id": "PER_AWESOME_DUDE",
      "as": "awesomeDude"
    },
    {
      "operator": "scope",
      "path": "awesomeDude",
      "scope": {
        "operator": "populateBEGAttributes",
        "as": "attributes"
      }
    }
  ]
}
```

For this second step of our query we've introduced a special operator known as `scope`. By default an operator operates on the entire piece of data it is given. What `scope` allows us to do is to "scope" the operator to only operate on a specific section of our data. In this case we only want to operate on the `awesomeDude` section of our data so we've set the `path` to `awesomeDude`.

What we then do is put the operator we want to use on this "scoped" section inside the `scope` key. In this case we've used the `populateBEGAttributes` operator because we want to get the attributes of a base entity and we've also used the `as` parameter again to store the result under the `attributes` key.

Let's now take a look at the result of the query that has our two steps / operators.

```json
{
  "baseEntities": {...},
  "attributes": {...},
  "awesomeDude": {
    "code": "PER_AWESOME_DUDE",
    "createdAt": "...",
    "updatedAt": "...",
    "attributes": {
      "firstName": "...",
      "lastName": "...",
      "email": "..."
    }
  }
}
```

We've now accomplished our goal of retrieving of all of the attributes for our base entity with code `PER_AWESOME_DUDE`.

## Accessing the result of a query inside layouts

As mentioned in the dedicated layout documentation, the result of any queries is stored inside the context that is available to the entire layout. This means you can access the result of the query using either the handlebars syntax...

`{{query.awesomeDude.attributes.firstName}}`

which will output a string or the underscore syntax...

`_query.awesomeDude.attributes.firstName`

which will pass through the raw data (great for arrays, objects etc).

## Dynamic queries / variables

In the basic example above we hardcoded the value `PER_AWESOME_DUDE`. But what if we wanted to use some dynamic data (like url parameters or props) instead of this value. We can use the same handlebars syntax that is available inside the layouts to dynamically include data. This means we can do something like this:

```json
{
  "query": [
    {
      "operator": "getBE",
      "id": "{{navigation.userID}}",
      "as": "awesomeDude"
    }
  ]
}
```

To pass in navigation data into the query.

## Data query operators
As mentioned above, we use a number of "operators" in order to process our data. A list of these is below.

TODO - Detailed usage instructions.

- `count`
- `dedupe`
- `distinct`
- `fetch`
- `find`
- `findOne`
- `get`
- `getBE`

### `getLinks`

Get links of a base entity.

#### `id` [ string ]

The code of the Base Entity to use as the starting point.

#### `onlyIncludeIf` [ array of objects ]

Optional inclusive filter criteria for each link. Each link will only be included if ALL criteria pass.

#### `onlyIncludeIf` [ array of objects ]

Optional exclusive filter criteria for each link. Each link will be excluded if ANY criteria match.

```json
{
  "operator": "getLinks",
  "id": "PER_USER1",
  "onlyIncludeIf": [
    {
      "path": "valueString",
      "value": "FRIEND"
    }
  ],
  "excludeIf": [
    {
      "path": "valueString",
      "value": "HOUSE"
    }
  ],
  "as": "items"
}
```

- `getFromAlias`
### `getLinkDepths`

Get the links of a base entity and iterate over the links of those base entities and so on, until all posible unique links have been found, and get the number of links between each of those base entities and the root base entity.

#### `code` [ string ]

The code of the Base Entity to use as the starting point.

#### `onlyIncludeIf` [ array of objects ]

Optional filter criteria for each link. Each link will only be included if ALL criteria pass.

```json
{
  "operator": "getLinkDepths",
  "code": "{{baseEntity.code}}",
  "onlyIncludeIf": [
    {
      "path": "linkValue",
      "value": "LNK_CORE"
    }
  ],
  "as": "depths"
}
```

- `map`
- `populateAttributes`
- `populateBEGAttributes`
- `populateLinkValues`
- `scope`

### `sort`

Sort an array of data by a specified field.

#### `by` [ array, string ]

Fields to use for sorting. Will start with the first field, and if the result is a match, then will move to the next field, and so on.

The fields used must match paths found in each data object.

#### `direction` [ "asc", "desc" ]

Determines direction of sort.

```json
{
  "operator": "scope",
  "path": "data",
  "scope": {
    "operator": "sort",
    "by": [
      "attributes.PRI_BIRTHDAY.value",
      "attributes.PRI_FIRSTNAME.value"
    ],
    "direction": "asc"
  }
}
```

## external operator

This operator is special case, in that doesn't run a query itself, it instead references a global function which is then processed with additional parameters (if supplied).

To use this operator, you need to do two things: define the query you want to run, and run it using the external operator.

### Define a Query

Create a folder file in the `/queries` directory in the project's `layouts` github repository.

Next create a `.json` file in the folder, and enter the following:

`myquery.json`
```
{
  "query": []
}
```

From here, create a data query as normal. If there are any variables you want to use in the query, simple use the handlebars syntax with keyword params `{{params.}}`, followed by the variable name you wish to use.

```
{
  "query": [
    {
      "operator": "getBE",
      "id": "{{params.variableId}}",
      "as": "{{params.varibleAs}}"
    }
  ]
}
```

### Calling a Query

Now the query has been defined, it can be called using the `external` operator. You must specify the name of the json file the query is in.

```
{
  "operator": "external",
  "name": "myquery"
}
```

Next, we can specify the parameters we want to pass to the query.

```
{
  "operator": "external",
  "name": "myquery",
  "params": {
    "variableId": "BEG_123",
    "asNvaribleAsame": "myBaseEntity"
  }
}
```

## Adding new data query operators

Whilst the large majority of data query needs will be satisfied by the operators above, you may occasionally need to add a new one. They are currently located in `src/utils/data-query/operators`.

To create a new operator all you need to do is create a file for your operator in that folder.

Below you'll find the base for all operators.

```js
export default ( data, options, allData ) => {
/**
 * Perform data operations here. Ensuring that you
 * are returning the updated data below. Remember
 * not to modify the `data` object itself.
 * It should not be mutated.
 * */
}
```

Just for reference the parameters (data, options and allData) are used as follows:

- `data` - contains the current state of the data (after any previous operators have been applied)
- `options` - contains all of the options that were passed into this operator.
- `allData` - contains the data as it was originally before the data was processed by any operators.

Once you've written your operator simple export it from the `index.js` file inside the operators folder as follows.

```js
export { default as myAwesomeOperator } from './myAwesomeOperator';
```

The operator is now available inside any layouts.

## onlyShowIf, dontShowIf

You can also use onlyShowIf and dontShowIf to run a series of queries if a condition is passed.

The only two fields needed are one of onlyShowIf or dontShowIf, and query. Query contains an array of queries that will only be processed if the conditional is met.

```json
{
  "operator": "scope",
  "path": "currentUser.links",
  "as": "requests",
  "scope": {
    "operator": "find",
    "query": {
      "valueString": {
        "$eq": "REQUEST"
      }
    }
  }
},
{
  "onlyShowIf": {
    "requests": {
      "$size": {
        "$gt": 10
      }
    }
  },
  "query": [
    {
      "operator":"scope",
      "path": "requests",
      "scope": {
        "operator":"find",
        "query":{
          "attributes.PRI_INTRODUCER_CODE.value": {
            "$eq": "{{otherUser.code}}"
          }
        }
      }
    }
  ]
}
```