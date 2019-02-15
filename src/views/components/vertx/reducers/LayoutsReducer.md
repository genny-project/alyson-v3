# Layouts Reducer

## Description

This reducer is designed to work parallel to the baseEntities reducer. The purpose of this reducer is to strip out all the unnecessary data, and format it so it is easy to access. The result is all Frames and Themes data in their own keys, each with the following fields:

```
For frames:

code,
name,
created,
links (looks for the links array),

For themes:

code,
name,
created,
data (looks for the attribute PRI_CONTENT),
isInheritable (looks for the attribute PRI_IS_INHERITABLE),
```

## Example

If these messages are sent from the backend...

```
{
  "data_type": "BaseEntity",
  "delete": false,
  "items": [
    {
      "baseEntityAttributes": [
        {
          "attributeCode": "PRI_NAME",
          "attributeName": "Name",
          "baseEntityCode": "FRM_ONE",
          "created": "2018-08-29T03:00:39",
          "inferred": false,
          "privacyFlag": false,
          "readonly": false,
          "value": "Frame One",
          "valueString": "Frame One"
        }
      ],
      "code": "FRM_ONE",
      "created": "2019-02-06T04:24:10",
      "delete": false,
      "id": 1000,
      "index": 0,
      "links": [
        {
          "created": "2019-02-06T04:24:58",
          "link": {
            "attributeCode": "LNK_FRAME",
            "linkValue": "CENTRE",
            "sourceCode": "FRM_ONE",
            "targetCode": "FRM_TWO",
            "weight": 1
          },
          "updated": "2019-02-06T04:25:25",
          "valueString": "CENTRE",
          "weight": 1
        },
        {
          "created": "2019-02-06T04:24:58",
          "link": {
            "attributeCode": "LNK_THEME",
            "linkValue": "CENTRE",
            "sourceCode": "FRM_TWO",
            "targetCode": "THM_BACKGROUND_RED",
            "weight": 6
          },
          "updated": "2019-02-06T04:25:25",
          "valueString": "CENTRE",
          "weight": 6
        }
      ],
      "name": "Frame One",
      "realm": "genny",
      "replace": true,
      "shouldDeleteLinkedBaseEntities": false,
      "totalCount": 1,
      "updated": "2019-02-06T04:24:10"
    }
  ],
  "msg_type": "DATA_MSG",
  "replace": true,
  "returnCount": 1,
  "shouldDeleteLinkedBaseEntities": false,
  "total": -1
}

{
  "data_type": "BaseEntity",
  "delete": false,
  "items": [
    {
      "baseEntityAttributes": [
        {
          "attributeCode": "PRI_CONTENT",
          "attributeName": "Content",
          "baseEntityCode": "THEME_BACKGROUND_RED",
          "created": "2018-08-29T03:00:39",
          "inferred": false,
          "privacyFlag": false,
          "readonly": false,
          "value": { "background": "red" },
          "valueString": { "background": "red" }
        }
      ],
      "code": "THEME_BACKGROUND_RED",
      "created": "2019-02-06T04:24:10",
      "delete": false,
      "id": 1000,
      "index": 0,
      "links": [
      ],
      "name": "Theme Background Red",
      "realm": "genny",
      "replace": true,
      "shouldDeleteLinkedBaseEntities": false,
      "totalCount": 1,
      "updated": "2019-02-06T04:24:10"
    }
  ],
  "msg_type": "DATA_MSG",
  "replace": true,
  "returnCount": 1,
  "shouldDeleteLinkedBaseEntities": false,
  "total": -1
}
```

Then the reducer will output this data...

```
{
  vertx: {
    ...,
    layouts: {
      frames: {
        ...,
        FRM_ONE: {
          code: 'FRM_ONE',
          created: '2019-02-06T04:24:10',
          name: 'Frame One,
          links: [
            {
              code: "FRM_TWO"
              created: "2019-02-06T04:24:58"
              panel: "CENTRE"
              type: "frame"
              weight: 1
            }
          ]
        },
        FRM_TWO: {
          code: 'FRM_TWO',
          created: '2019-02-06T04:24:10',
          name: 'Frame TWO,
          links: [
            {
              code: "THM_BACKGROUND_RED"
              created: "2019-02-06T04:24:58"
              panel: "CENTRE"
              type: "theme"
              weight: 1
            }
          ]
        }
      },
      themes: {
        THM_BACKGROUND_RED:
          code: "THM_BACKGROUND_RED"
          created: "2019-02-06T04:24:10"
          data: {
            backgroundColor: "red"
          },
          isInheritable: true,
          name: "Theme Background Red"
      }
    }
  }
}
```