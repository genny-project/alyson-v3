import React, { Component, isValidElement } from 'react';
import { array, bool, object, any } from 'prop-types';
import { Menu, MenuButton, MenuItem, MenuList, MenuLink } from '@reach/menu-button';
import { withRouter } from 'react-router-dom';
import { isArray, isString, Bridge } from '../../../utils';
import { Recursive } from '../../components';
import './Dropdown.css';

class Dropdown extends Component {
  static propTypes = {
    items: array.isRequired,
    text: any,
    facingRight: bool,
    disabled: bool,
    menuButtonStyle: object,
    menuListStyle: object,
    menuLinkStyle: object,
    menuItemStyle: object,
    children: any,
    history: object,
  }

  handleSelect = item => () => {
    if ( item.buttonCode ) {
      const {
        value,
        buttonCode = '',
        messageType = 'BTN',
        eventType = 'BTN_CLICK',
      } = item;

      const valueString = (
        value &&
        typeof value === 'string'
      )
        ? value
        : JSON.stringify( value );

      Bridge.sendEvent({
        event: messageType,
        eventType,
        sendWithToken: true,
        data: {
          code: buttonCode,
          value: valueString || null,
        },
      });
    }
  }

  handleNavigate = item => event => {
    event.preventDefault();

    const href = (
      item.href === 'home' ? '/'
      : item.href.startsWith( '/' ) ? item.href
      : `/${item.href}`
    );

    this.props.history.push( href );

    return false;
  }

  handleSelect = item => () => {
    if ( item.buttonCode ) {
      const {
        value,
        buttonCode = '',
        messageType = 'BTN',
        eventType = 'BTN_CLICK',
      } = item;

      const valueString = (
        value &&
        typeof value === 'string'
      )
        ? value
        : JSON.stringify( value );

      Bridge.sendEvent({
        event: messageType,
        eventType,
        sendWithToken: true,
        data: {
          code: buttonCode,
          value: valueString || null,
        },
      });
    }
  }

  render() {
    const {
      items,
      text,
      facingRight,
      menuButtonStyle,
      menuListStyle,
      menuLinkStyle,
      menuItemStyle,
      disabled,
      children,
    } = this.props;

    return (
      <Menu>
        <MenuButton
          disabled={disabled || !isArray( items, { ofMinLength: 1 })}
          style={menuButtonStyle}
        >
          {isValidElement( children ) ? children
          : isString( text ) ? text
          : isArray( children )
            ? children.map(( child, i ) => (
              isValidElement( child )
                ? child
                : <Recursive key={i} {...child} /> // eslint-disable-line
            ))
            : <Recursive {...children} />
          }
        </MenuButton>

        {isArray( items, { ofMinLength: 1 }) && (
          <MenuList
            style={{
              position: 'absolute',
              top: '100%',
              ...facingRight
                ? { right: 0 }
                : { left: 0 },
              ...menuListStyle,
            }}
          >
            {items.map( item => (
              item.href ? (
                <MenuLink
                  key={item.text}
                  to={(
                    item.href === 'home' ? '/'
                    : item.href.startsWith( '/' ) ? item.href
                    : `/${item.href}`
                  )}
                  style={{
                    ...menuItemStyle,
                    ...menuLinkStyle,
                  }}
                  onClick={this.handleNavigate( item )}
                >
                  {item.text}
                </MenuLink>
              ) : (
                <MenuItem
                  key={item.text}
                  style={menuItemStyle}
                  onSelect={this.handleSelect( item )}
                >
                  {isValidElement( item.children ) ? item.children
                  : isString( item.text ) ? item.text
                  : isArray( item.children )
                    ? item.children.map(( child, i ) => (
                      isValidElement( child )
                        ? child
                        : <Recursive key={i} {...child} /> // eslint-disable-line
                    ))
                    : <Recursive {...item.children} />
                  }
                </MenuItem>
              )
            ))}
          </MenuList>
        )}
      </Menu>
    );
  }
}

export default withRouter( Dropdown );
