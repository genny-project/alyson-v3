# Form Generic

## Description

Renders a form with specific fields that arent derived from Question Groups.

## Example

```json
{
  "component": "FormGeneric",
  "props": {
    "onSubmitSendEvent": true,
    "eventType": "BTN_CLICK",
    "buttonCode": "BTN_ADD_NOTE",
    "value": {
      "userCode": "{{user.data.code}}",
      "itemCode": "{{query.aliases.CURRENT_NOTE}}"
    },
    "injectFormValuesIntoValue": {
      "message": "note"
    },
    "resetFormOnSubmit": true
  },
  "children": [
    {
      "component": "Box",
      "props": {
        "flexGrow": 1,
        "flexShrink": 0,
        "flexDirection": "column",
        "justifyContent": "space-between",
        "width": "100%"
      },
      "children": [
        {
          "component": "FormGenericInput",
          "props": {
            "type": "textarea",
            "name": "note",
            "maxLength": 1000,
            "padding": 15,
            "borderStyle": "solid",
            "borderColor": "#DDD",
            "backgroundColor": "white",
            "borderWidth": 1,
            "showCharacterCount": true,
            "submitOnEnterPress": true,
            "renderCharacterCount": {
              "component": "Box",
              "props": {
                "position": "absolute",
                "bottom": 5,
                "right": 10
              },
              "children": [
                {
                  "component": "Text",
                  "props": {
                    "size": "xxs",
                    "color": "grey",
                    "paddingBottom": 20,
                    "borderColor": "#ddd",
                    "text": "{{characterCount}} / {{maxLength}}"
                  }
                }
              ]
            }
          }
        },
        {
          "component": "Box",
          "props": {
            "marginTop": 10,
            "width": "100%"
          },
          "children": [
            {
              "component": "FormGenericSubmit",
              "props": {
                "padding": 0,
                "width": "100%",
                "text": "Add note",
                "color": "green",
                "formProps": "_formProps",
                "disabledWhenFormInvalid": true
              }
            }
          ]
        }
      ]
    }
  ]
}```

## Props

| Prop Name | Prop Type | Description |
| :-------- | :-------: | :---------- |
| children | node | content of the form |
| testID | string | identifier used for testing |
| validation | object | specify regex for validation, error warnings, and if input is required |
| onSubmitSendEvent | bool | should an event be sent to back end on submit |
| value | object | data sent to backend |
| buttonCode | string | code of the submit event |
| eventType | string | event type of submit |
| messageType | string | message type of submit |
| injectFormValuesIntoValue | bool | ? |
| resetFormOnSubmit | bool | should form inputs be cleared when submitted |
| submitOnEnterPress | bool | should form be submitted when the last input is clicked |
| wrapperProps | object | styling passed to the forms wrapper Box component |