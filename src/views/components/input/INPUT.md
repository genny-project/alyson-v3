# Input

## Description

Component used to allow users to submit data.

Input can be used as a standalone component, but most often is used as part of a form. In the latter case, the props passed to the Input are collated by the Form component based on the data in the store.

## List of Input Types

| Type | Component | Additional Props | Description |
|:-----|:----------|:------------| :------------|
| text, abn number, acn number, double | InputText | - | Plain text field |
| password | InputText | secureTextEntry | Text field, but with hidden characters |
| email | InputText | keyboardType="email-address" |  |
| htmlarea, textarea | InputText | multiline, numberOfLines={3}, height={100} |  |
| number, java.lang.integer, java.lang.long, java.lang.Long ,java.lang.Integer, mobile, landline | InputText | keyboardType="phone-pad" |  |
| currency, org.javamoney.moneta.money | InputCurrency | - |  |
| java.lang.boolean, switch | Switch | - |  |
| read, termsandconditions | InputRead | - |  |
| scroll | InputScroll | - |  |
| rating | InputRating | - |  |
| autocomplete | InputAutocomplete | - |  |
| address | InputAddress | - |  |
| dropdown | InputDropdown | - |  |
| checkbox | CheckBox | - |  |
| radio | CheckBox | radio |  |
| file, upload | InputFile | - |  |
| image, Image | InputFile | imageOnly |  |
| date, java.time.localdate | InputDatePicker | date |  |
| datetime, java.time.localdatetime | InputDatePicker | date, time |  |
| mobileverification | Passcode | - |  |
| codeverificationfive, codeVerificationFive | Passcode | numberOfInputs={5}, keyboardType="default" |  |
| credit-card | InputCreditCard | - |  |
| checkboxmultiple | InputCheckbox | - |  |
| payment | InputPayment | - |  |
| audiorecord, audioRecord | AudioRecord | - |  |
| segmentedcontrol | SegmentedControl | - |  |
| dropdownmultiple | InputTag | allowMultipleSelection |  |
| tag | InputTag | - |  |
| signature | Signature | - |  |
| rich-text-editor | RichTextEditor | - |  |

## Props

| Prop Name | Prop Type | Description |
| :-------- | :-------: | :---------- |
| type | string.isRequired | The type of input to be rendered |
| typeOnlyProps | object | Props that will only be passed to a component with a type that matches a key in typeOnlyProps |