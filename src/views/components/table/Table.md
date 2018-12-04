# Table component

## Description

Component to display data as a table. Uses the react-table package.

## Example

`parent.json`
```json
{
  "layout": {
    "title": "Give a Nice title",
    "appColor": "white",
    "backgroundColor": "whitesmoke",
    "header": {
      "variant": "default"
    },
    "sidebar": {
      "variant": "default"
    }
  },
  "children": [
    {
      "component": "Box",
      "children": [
        {
          "component": "Table",
          "props": {
            "renderWrapper": {
              "component": "EventButton",
              "props": {
                "height": "20px",
                "fontWeight": "300",
                "fontSize": 10,
                "eventType": "BTN_CLICK",
                "buttonCode": "BTN_TABLE_SELECT",
                "value": {
                  "itemCode": "_celld.attributeCode",
                  "hint": "GRP_EDU_PROVIDER_REPRESENTATIVES",
                  "userCode": "{{user.data.code}}"
                }
              }
            },
            "columns": [
              {
                "Header": "Actions",
                "accessor": "actions",
                "renderButton": [
                  {
                    "component": "EventButton",
                    "props": {
                      "height": "30px",
                      "width": "80px",
                      "backgroundColor": "red",
                      "color": "#5173c6",
                      "textColor": "#fff",
                      "text": "Edit",
                      "buttonCode": "BTN_EDIT_EDU_PROVIDER_STAFF",
                      "value": {
                        "itemCode": "{{attributeCode}}"
                      }
                    }
                  },
                  {
                    "component": "EventButton",
                    "props": {
                      "height": "30px",
                      "width": "80px",
                      "backgroundColor": "red",
                      "color": "#5173c6",
                      "textColor": "#fff",
                      "text": "View",
                      "buttonCode": "BTN_VIEW_EDU_PROVIDER_STAFF",
                      "value": {
                        "itemCode": "{{attributeCode}}"
                      },
                      "dispatchActionOnClick": {
                        "type": "ALIAS_ADD",
                        "payload": {
                          "alias": "CURRENT_NOTE",
                          "value": "{{attributeCode}}"
                        }
                      }
                    }
                  }
              ]
              },
              {
                "Header": "First Name",
                "accessor": "firstName",
                "filterType": "string"
              },
              {
                "Header": "Email",
                "accessor": "email",
                "filterType": "string"
              },
              {
                "Header": "Phone Number",
                "accessor": "mobilePhone",
                "filterType": "string"
              },
              {
                "Header": "University ",
                "accessor": "university",
                "filterType": "string"
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
      "id": "GRP_EDU_PROVIDER_REPRESENTATIVES",
      "as": "hostCompanies"
    },
    {
      "operator": "scope",
      "path": "hostCompanies",
      "scope": {
        "operator": "populateLinkValues",
        "withAttributes": true,
        "multiple": true,
        "as": "items"
      }
    },
    {
      "operator": "scope",
      "path": "hostCompanies",
      "scope": {
        "operator": "scope",
        "path": "items",
        "scope": {
          "operator": "getBE",
          "as" : "company",
          "id": "{{attributes.LNK_EDU_PROVIDER.value}}"
        }
      }
    },
    {
      "operator": "scope",
      "path": "hostCompanies",
      "scope": {
        "operator": "scope",
        "path": "items",
        "scope": {
          "operator": "scope",
          "path": "company",
          "scope": {
            "operator": "populateAttributes",
            "as" : "attributes",
            "code": "{{code}}"
          }
        }
      }
    },
    {
      "operator": "scope",
      "path": "hostCompanies",
      "scope": {
        "operator": "scope",
        "path": "items",
        "scope": {
          "operator": "getBE",
          "as" : "currentUser",
          "id": "{{user.data.code}}"
        }
      }
    },
    {
      "operator": "scope",
      "path": "hostCompanies.items",
      "as": "tableData",
      "scope": {
        "operator": "map",
        "fields": {
          "firstName": "attributes.PRI_FIRSTNAME.value",
          "email": "attributes.PRI_EMAIL.value",
          "mobilePhone": "attributes.PRI_MOBILE.value",
          "university": "company.attributes.PRI_NAME.value",
          "extraFields": {
          },
          "attributeCode": "code",
          "currentUser": "currentUser.code"
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
=======
```
