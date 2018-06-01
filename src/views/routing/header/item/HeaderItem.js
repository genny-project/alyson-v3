import React, { Component } from 'react';
import { string } from 'prop-types';
import { Link, Button } from '../../../components';

class HeaderItem extends Component {
  static propTypes = {
    icon: string,
    href: string,
    textColor: string,
  }

  render() {
    const { icon, href, textColor } = this.props;

    return (
      <Link
        to={href}
      >
        <Button
          size="md"
          color="transparent"
          textColor={textColor}
          icon={icon}
          paddingX={5}
          paddingY={5}
        />
      </Link>
    );
  }
}

export default HeaderItem;
