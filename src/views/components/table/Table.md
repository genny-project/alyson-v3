# Table component

## Prop Types

```sh
data: Array
columns: Array
```

## Example from Internmatch

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