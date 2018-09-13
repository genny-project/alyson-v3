# Table component

## Prop Types

```sh
data: Array
columns: Array
```

## Example

```json

{
  "component": "Table",
  "props": {
    "data": [{
        "firstName": "Marco",
        "lastName": "Polo",
        "age": 32,
      },
      ],
    "columns": [{
        "Header": "First Name",
        "accessor": "firstName",
      },
      {
        "Header": "Last Name",
        "accessor": "lastName",
      },
      {
        "Header": "age",
        "accessor": "age",
      }]
  }
}
```