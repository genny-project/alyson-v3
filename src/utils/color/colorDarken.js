import Color from 'color';

const colorDarken = ( value, darkenAmount ) => {
  const color = (
    Color( value )
      .darken( darkenAmount )
      .hex()
  );

  return color;
};

export default colorDarken;
