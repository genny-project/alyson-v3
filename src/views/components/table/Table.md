# Table component

## Description

Component to display data as a table. Uses the react-table package.

## Example

`parent.json`
```json

{
  "layout": {
    "title": "Table View",
    "appColor": "white",
    "backgroundColor": "#0d0d0d"
  },
  "children": [
    {
      "component": "Box",
      "children": [
        {
          "component": "Table",
          "props": {
            "columns": [
              {
                "Header": "Full Name",
                "accessor": "firstName"
              },
              {
                "Header": "Edu Provider",
                "accessor": "eduProvider"
              },
              {
                "Header": "Mobile Phone",
                "accessor": "mobilePhone"
              },
              {
                "Header": "Username",
                "accessor": "uname"
              }
            ],
            "tableBackgroundColor": "#cccccc",
            "data": "_query.tableData",
            "height": "500px",
            "width": "500px",
            "itemsPerPage": 15
          }
        }
      ]
    }
  ],
  "query": [
    {
      "operator": "getBE",
      "id": "GRP_INTERNS",
      "as": "internList"
    },
    {
      "operator": "scope",
      "path": "internList.links",
      "as": "internList",
      "scope": {
        "operator": "getBE",
        "basePath": "baseEntities.data",
        "id": "{{link.targetCode}}",
        "as": "be"
      }
    },
    {
      "operator": "scope",
      "path": "internList",
      "scope": {
        "operator": "scope",
        "path": "be",
        "scope": {
          "operator": "populateBEGAttributes",
          "as": "attributes"
        }
      }
    },
    {
      "operator": "scope",
      "path": "internList",
      "scope": {
        "operator": "getBE",
        "as" : "company",
        "basePath": "baseEntities.data",
        "id": "{{be.attributes.LNK_EDU_PROVIDER.value}}"
      }
    },
    {
      "operator": "scope",
      "path": "internList",
      "as": "tableData",
      "scope": {
        "operator": "map",
        "fields": {
          "firstName": "be.attributes.PRI_NAME.value",
          "eduProvider": "company.name",
          "mobilePhone": "be.attributes.PRI_MOBILE.value",
          "uname": "be.attributes.PRI_USERNAME.value"
        }
      }
    }
  ]
}

```

## Props


| Prop Name | Prop Type | Description |
| :-------- | :-------: | :---------- |
| data | array | data to be displayed in the table |
| columns | array | specifies the headers of the columns and which data field is used for each row cell in that column |
| filterable | bool | displays filter fields at the top of each column |
| itemsPerPage | number | number of rows to display per page |
| tableBackgroundColor | string | colour of the table |
| tableHeight | oneOfType( [number, string] ) | height of the table |
| tableWidth | oneOfType( [number, string] ) | width of the table |
| containerBackgroundColor | string | colour of the table container |
| buttonTextColor | string | colour of buttons in the table |
| isSelectable | bool | table rows are selectable, which highlights the row |
| selectFirstItemOnMount | bool | selects the first row when the table is mounted |
| itemToSelectFirst | object | specify an item to load first. if not in the data, will default to the first |
| dispatchActionOnChange | object | an action to dispatch to the store when an item is changed |
| renderWrapper | object | element that can be rendered as a wrapper around each of the cells in the table |
| cellContext | object | data to be passed to the context of each cell |