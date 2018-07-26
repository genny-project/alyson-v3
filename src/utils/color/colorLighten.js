import Color from 'color';

const colorLighten = ( value, lightenAmount ) => {
  const color = (
    Color( value )
      .lighten( lightenAmount )
      .hex()
  );

  return color;
};

export default colorLighten;
