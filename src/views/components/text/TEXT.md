# Text

## Description

The main component used to render blocks of text.

## Props

| Prop Name | Prop Type | Default | Description |
| :-------- | :-------: |  :----: |:---------- |
| children | number, string | – | Text to be rendered. |
| text | string | – | Text to be rendered. |
| color | string | 'black' | One of: 'black', 'green', 'red', 'blue', 'white', 'transparent', or a hexidecimal string |
| decoration | string | 'none' | One of: 'none' |
| fontWeight | string | – | Sets the font weight of the text. |
| bold | bool | – | Text will be bolded. Overrides `fontWeight` |
| size | string | 'sm' | One of: 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl' |
| align | string | – | One of: 'auto', 'left', 'right', 'center', 'justify' |
| height | number, string | – | Height of the text component |
| width | number, string | – | Weight of the text component |
| fontFamily | string | - | Will default to 'system-ui, sans-serif' on web, and 'System' on Native |
| transform | string | – | One of: 'upperCase', 'lowerCase', 'capitalize' |
