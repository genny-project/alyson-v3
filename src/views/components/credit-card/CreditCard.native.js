import React from 'react';
import { string, number, object } from 'prop-types';
import { CardView } from 'react-native-credit-card-input';

const CreditCard = ({
  focused,
  brand,
  name,
  number,
  expiry,
  cvc,
  placeholder,
  scale,
  fontFamily,
  imageFront,
  imageBack,
  customIcons,
  testID = 'credit-card-view',
}) => (
  <CardView
    focused={focused}
    brand={brand}
    name={name}
    number={number}
    expiry={expiry}
    cvc={cvc}
    placeholder={placeholder}
    scale={scale}
    fontFamily={fontFamily}
    imageFront={imageFront}
    imageBack={imageBack}
    customIcons={customIcons}
    testID={testID}
  />
);

CreditCard.propTypes = {
  focused: string,
  brand: string,
  name: string,
  number: string,
  expiry: string,
  cvc: string,
  placeholder: object,
  scale: number,
  fontFamily: string,
  imageFront: number,
  imageBack: number,
  customIcons: object,
  testID: string,
};

export default CreditCard;
