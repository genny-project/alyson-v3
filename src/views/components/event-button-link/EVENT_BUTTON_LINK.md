# Event Button Link

## Description

This component renders a Button, that does two things when pressed. First, it sends a Vertex message to the backend, and second, navigates to a route in the application.

## Props

### All Platforms

```
children: any,
buttonCode: string.isRequired,
value: string.isRequired,
onPress: func,
disabled: bool,
useAppNavigator: bool,
navigation: object,
params: object,
to: string,
```

### Web Only

```
decoration: string,
```