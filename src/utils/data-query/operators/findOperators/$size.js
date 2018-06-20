import * as operators from './';

export default ( input, value ) => {
  if (
    input != null &&
    input instanceof Array
  ) {
    if (
      value != null &&
      typeof value === 'object' &&
      !( value instanceof Array )
    ) {
      return Object.keys( value ).every( key => {
        const operator = operators[key];
        const operatorValue = value[key];

        return operator( input.length, operatorValue );
      });
    }

    return input.length === value;
  }

  return false;
};
