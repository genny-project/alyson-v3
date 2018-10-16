import React, { Component, createElement } from 'react';
import { string } from 'prop-types';
import { Link, Button, EventButton } from '../../index';

class HeaderItem extends Component {
  static defaultProps = {
    testID: 'header-item',
  }

  static propTypes = {
    icon: string,
    href: string,
    textColor: string,
    buttonCode: string,
    testID: string,
  }

  render() {
    const { icon, href, textColor, buttonCode, testID, ...restProps } = this.props;

    const buttonProps = {
      size: 'md',
      color: 'transparent',
      padding: 5,
      textColor,
      icon,
      buttonCode,
      showSpinnerOnClick: false,
      ...restProps,
    };

    return (
      <Link
        pure
        to={href}
        testID={testID}
      >
        {createElement(
          buttonCode ? EventButton : Button,
          buttonProps
        )}
      </Link>
    );
  }
}

export default HeaderItem;
