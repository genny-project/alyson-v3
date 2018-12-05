import React, { Component } from 'react';
import { Link as ReactRouterLink, withRouter } from 'react-router-dom';
import { string, bool, any, func, oneOf, object } from 'prop-types';
import { withKeycloak } from '../keycloak';
import { Touchable } from '../index';

class Link extends Component {
  focus() {
    if ( this.link )
      this.link.focus();
  }

  handleClick = event => {
    const { onPress, disabled } = this.props;

    if ( disabled ) {
      event.preventDefault();
      event.stopPropagation();

      return false;
    }

    if ( onPress )
      onPress( event );
  }

  handleNavigate = event => {
    const { disabled, to, history } = this.props;

    if ( !disabled )
      history.push( to );

    this.handleClick( event );
  }

  render() {
    const {
      children = 'Link',
      to,
      disabled = false,
      decoration = 'none',
      wrapperProps = {},
      withFeedback = true,
      onPress, // eslint-disable-line
      ...restProps
    } = this.props;

    const href = (
      to === 'home' ? '/'
      : to.startsWith( '/' ) ? to
      : `/${to}`
    );

    if ( typeof children === 'function' ) {
      return children({
        onPress: this.handleNavigate,
      });
    }

    return (
      <ReactRouterLink
        {...wrapperProps}
        to={href}
        onClick={this.handleClick}
        style={{
          ...wrapperProps.style,
          textDecoration: decoration,
        }}
        ref={link => this.link = link}
        disabled={disabled}

      >
        <Touchable
          {...restProps}
          withFeedback={withFeedback}
        >
          {children}
        </Touchable>
      </ReactRouterLink>
    );
  }
}

Link.propTypes = {
  children: any,
  to: string.isRequired,
  disabled: bool,
  onPress: func,
  decoration: oneOf(
    ['none', 'underline', 'line-through']
  ),
  history: object,
  wrapperProps: object,
  withFeedback: bool,
};

export default withKeycloak( withRouter( Link ));
