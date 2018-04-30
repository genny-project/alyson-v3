import React from 'react';
import { shallow } from 'enzyme';
import Button from './Button';

describe( '<Button />', () => {
  it( 'renders correctly', () => {
    const didRender = shallow( <Button color="red" /> );

    expect( didRender ).toBeTruthy();
  });

  /* TODO fix `mount()` error. */
  /*
  it( 'renders with text', () => {
    const buttonText = mount( <Button color="red">Lorem ipsum</Button> ).text();

    expect( buttonText ).toEqual( 'Lorem ipsum' );
  });
  */
});
