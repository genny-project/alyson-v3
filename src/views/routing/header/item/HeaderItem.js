import React, { Component, createElement } from 'react';
import { string } from 'prop-types';
import { Link, Button, EventButton } from '../../../components';

class HeaderItem extends Component {
  static propTypes = {
    icon: string,
    href: string,
    textColor: string,
    buttonCode: string,
  }

  render() {
    const { icon, href, textColor, buttonCode, ...restProps } = this.props;

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
        to={href}
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
