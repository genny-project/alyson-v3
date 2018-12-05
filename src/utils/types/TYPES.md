# TYPES

## Description

Types are functions which are used to check the types of variables and to evaluate them against certain criteria.

## Usage

All are used in the same way:

```
isArray( var, { options })
```

## isArray

Checks if the variable is an Array.

### Options

```
{
  ofMaxLength,
  ofMinLength,
  ofExactLength,
}
```

## isInteger

Checks if the variable is an Integer.

### Options

```
{
  isEqualTo,
  isNotEqualTo,
  isLessThan,
  isGreaterThan,
  isLessThanOrEqualTo,
  isGreaterThanOrEqualTo,
}
```

## isObject

Checks if the variable is an Object.

### Options

Use the first option if you want to specify multiple fields, the second if you wish to check for one field only.

```
{
  withProperties, ( array of string )
  withProperty, ( string )
}
```

## isString

Checks if the variable is a String.

### Options

```
{
  ofMaxLength,
  ofMinLength,
  ofExactLength,
  startsWith,
  endsWith,
  includes,
}
```