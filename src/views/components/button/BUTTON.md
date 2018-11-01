# Button

## Description

Basic button component.

## Props

```
children: string,
text: string,
disabled: bool,
onPress: func,
color: string,
textColor: string,
fontWeight: string,
icon: string,
size: oneOf(
  ['sm', 'md', 'lg']
),
padding: number,
paddingX: number,
paddingY: number,
accessibilityLabel: string,
accessibilityRole: string,
accessible: bool,
width: oneOfType(
  [number, string]
),
height: oneOfType(
  [number, string]
),
showSpinnerOnClick: bool,
withFeedback: bool,
shape: string,
boxShadow: string,
submitting: bool,
confirmation: shape({
  message: string,
  title: string,
  buttons: arrayOf(
    shape({
      type: oneOf(
        ['ok', 'cancel', 'no']
      ),
      style: oneOf(
        ['default', 'cancel', 'destructive']
      ),
      text: string,
    }),
  ),
}),
isSpinning: bool,
marginTop: number,
marginBottom: number,
marginLeft: number,
marginRight: number,
marginX: number,
borderWidth: number,
borderColor: string,
inverted: bool,
theme: shape({
  components: object,
}),
```


## Example

```json 
{
  "component": "Box",
  "children": {
    "component": "Button",
    "props": {
      "text":"View Document",
      "textColor":"#ffffff",
      "color": "#008001",
      "size": "lg",
      "height": "45px",
      "width": "200px",
      "shape": "rounded",
      "fontFamily":"arial"
    }
  },
  "props": {
    "flexDirection":"row",
    "justifyContent":"center",
    "paddingTop": "30px"
  }
}

```