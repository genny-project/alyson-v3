import React, { Component } from 'react';
import { string, object } from 'prop-types';
import { Link, Button } from '../index';

class LinkButton extends Component {
  static propTypes = {
    to: string.isRequired,
    linkProps: object,
  }

  render() {
    const { linkProps, to, ...restProps } = this.props;

    return (
      <Link
        {...linkProps}
        to={to}
        useAppNavigator={false}
      >
        {({ onPress }) => (
          <Button
            {...restProps}
            onPress={onPress}
          />
        )}
      </Link>
    );
  }
}

export default LinkButton;
