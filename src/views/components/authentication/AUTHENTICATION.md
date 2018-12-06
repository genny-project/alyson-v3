# Authentication Form

## Description

Form used for login and registration. Used with public pages, and send information to keycloak to login or create a new account.

## Example

```json
{
  "component": "AuthenticationForm",
  "props": {
    "type": "register",
    "validation": {
      "email": {
        "regex": "^(\\w[-._+\\w]*\\w@\\w[-._\\w]*\\w\\.\\w{2,20})$",
        "warning": "Invalid Email Address",
        "isRequired": true
      },
      "firstname": {
        "regex": "^[a-zA-Z\\_\\.]{1,100}$",
        "warning": "Please enter a first name",
        "isRequired": true
      },
      "lastname": {
        "regex": "^[a-zA-Z\\_\\.]{1,100}$",
        "warning": "Please enter a last name",
        "isRequired": true
      },
      "password": {
        "regex": "^.{4,}$",
        "warning": "Password must be at least 4 characters",
        "isRequired": true
      }
    }
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
          "component": "Box",
          "props": {
            "flexDirection": "column"
          },
          "children": [
            {
              "component": "Box",
              "props": {
                "paddingBottom": "7px"
              },
              "children": [
                {
                  "component": "Text",
                  "props": {
                    "text": "Email",
                    "color": "black"
                  }
                }
              ]
            },
            {
              "component": "Box",
              "props": {
                "paddingBottom": "20px"
              },
              "children": [
                {
                  "component": "FormGenericInput",
                  "useThemeFrom": "Input",
                  "variant": "default",
                  "props": {
                    "type": "email",
                    "placeholder": " Email",
                    "name": "email",
                    "borderWidth": 1,
                    "borderColor": "#000000",
                    "borderRadius": "5px",
                    "height": 50,
                    "backgroundColor": "#FFFFFF"
                  }
                }
              ]
            },
            {
              "component": "Box",
              "props": {
                "paddingBottom": "7px"
              },
              "children": [
                {
                  "component": "Text",
                  "props": {
                    "text": "First Name",
                    "color": "black"
                  }
                }
              ]
            },
            {
              "component": "Box",
              "props": {
                "paddingBottom": "20px"
              },
              "children": [
                {
                  "component": "FormGenericInput",
                  "useThemeFrom": "Input",
                  "variant": "default",
                  "props": {
                    "type": "text",
                    "placeholder": " First name",
                    "name": "firstname",
                    "borderWidth": 1,
                    "borderColor": "#000000",
                    "borderRadius": "5px",
                    "height": 50,
                    "backgroundColor": "#FFFFFF"
                  }
                }
              ]
            },
            {
              "component": "Box",
              "props": {
                "paddingBottom": "7px"
              },
              "children": [
                {
                  "component": "Text",
                  "props": {
                    "text": "Last Name",
                    "color": "black"
                  }
                }
              ]
            },
            {
              "component": "Box",
              "props": {
                "paddingBottom": "20px"
              },
              "children": [
                {
                  "component": "FormGenericInput",
                  "useThemeFrom": "Input",
                  "variant": "default",
                  "props": {
                    "type": "text",
                    "placeholder": " Last name",
                    "name": "lastname",
                    "borderWidth": 1,
                    "borderColor": "#000000",
                    "borderRadius": "5px",
                    "height": 50,
                    "backgroundColor": "#FFFFFF"
                  }
                }
              ]
            },
            {
              "component": "Box",
              "props": {
                "paddingBottom": "7px"
              },
              "children": [
                {
                  "component": "Text",
                  "props": {
                    "text": "Password",
                    "color": "black"
                  }
                }
              ]
            },
            {
              "component": "Box",
              "props": {
                "paddingBottom": "20px"
              },
              "children": [
                {
                  "component": "FormGenericInput",
                  "useThemeFrom": "Input",
                  "variant": "default",
                  "props": {
                    "type": "password",
                    "placeholder": " Password",
                    "name": "password",
                    "borderWidth": 1,
                    "borderColor": "#000000",
                    "borderRadius": "5px",
                    "height": 50,
                    "backgroundColor": "#FFFFFF"
                  }
                }
              ]
            }
          ]
        },
        {
          "component": "Box",
          "props": {
            "flexDirection": "column"
          },
          "children": [
            {
              "component": "Box",
              "props": {
                "paddingBottom": "20px"
              },
              "children": [
                {
                  "component": "FormGenericStatus",
                  "props": {
                    "wrapperProps": {
                      "borderWidth": 2,
                      "borderColor": "red",
                      "borderStyle": "solid",
                      "alignItems": "center",
                      "justifyContent": "center",
                      "padding": "20px",
                      "cleanStyleObject": true,
                      "width": "100%"
                    },
                    "textProps": {
                      "color": "red",
                      "bold": true,
                      "align": "center"
                    }
                  }
                }
              ]
            },
            {
              "component": "FormGenericSubmit",
              "props": {
                "disabledWhenFormInvalid": true,
                "text": "Register",
                "color": "#3c67c8",
                "textColor": "white",
                "size": "xl",
                "height": "50px",
                "width": "300px",
                "padding": "20px",
                "formProps": "_formProps"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

## Props

| Prop Name | Prop Type | Description |
| :-------- | :-------: | :---------- |
| children | node | content of the form |
| testID | string | identifier used for testing |
| validation | object | specify regex for validation, error warnings, and if input is required |
| type | oneOf( ['register', 'login'] ) | how the information is sent to keycloak |
| submitOnEnterPress | bool | should form be submitted when the last input is clicked |
| wrapperProps | object | styling passed to the forms wrapper Box component |