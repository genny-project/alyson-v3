import React, { Component, isValidElement } from 'react';
import { array, bool, object, any, string } from 'prop-types';
import { Menu, MenuButton, MenuItem, MenuList, MenuLink } from '@reach/menu-button';
import { withRouter } from 'react-router-dom';
import { isArray, isString, Bridge } from '../../../utils';
import './Dropdown.css';

class Dropdown extends Component {
  static propTypes = {
    items: array.isRequired,
    text: any,
    facingRight: bool,
    disabled: bool,
    testID: string,
    menuButtonStyle: object,
    menuListStyle: object,
    menuLinkStyle: object,
    menuItemStyle: object,
    children: any,
    history: object,
    renderItem: object,
    context: object,
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
      testID,
      renderItem,
    } = this.props;

    return (
      <Menu>
        <MenuButton
          disabled={disabled || !isArray( items, { ofMinLength: 1 })}
          style={menuButtonStyle}
          data-testID={`dropdown ${testID}`}
        >
          {isValidElement( children ) ? children
          : isString( text ) ? text
          : isArray( children )
            ? children.map(( child ) => (
              isValidElement( child )
                ? child
                : null
            ))
            : null
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
            {items.map( item => {
              if ( renderItem ) {
                const context = {
                  ...this.props.context,
                  item,
                };

                const child = (
                  isValidElement( renderItem ) ? renderItem
                  : isString( renderItem ) ? renderItem
                  : isArray( renderItem )
                    ? renderItem.map(( item, i ) => (
                      isValidElement( item )
                        ? item
                        : null
                    ))
                    : null
                );

                if ( item.href ) {
                  return (
                    <MenuLink
                      key={item.text}
                      data-testID={`dropdown-item ${testID}`}
                      to={(
                        item.href === 'home' ? '/'
                        : item.href.startsWith( '/' ) ? item.href
                        : `/${item.href}`
                      )}
                      onClick={this.handleNavigate( item )}
                    >
                      {child}
                    </MenuLink>
                  );
                }

                return (
                  <MenuItem
                    key={item.text}
                    data-testID={`dropdown-item ${testID}`}
                    onSelect={this.handleSelect( item )}
                  >
                    {child}
                  </MenuItem>
                );
              }

              if ( item.href ) {
                return (
                  <MenuLink
                    key={item.text}
                    data-testID={`dropdown-item ${testID}`}
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
                );
              }

              return (
                <MenuItem
                  key={item.text}
                  style={menuItemStyle}
                  data-testID={`dropdown-item ${testID}`}
                  onSelect={this.handleSelect( item )}
                >
                  {isValidElement( item.children ) ? item.children
                  : isString( item.text ) ? item.text
                  : isArray( item.children )
                    ? item.children.map(( child, i ) => (
                      isValidElement( child )
                        ? child
                        : null
                    ))
                    : null
                  }
                </MenuItem>
              );
            })}
          </MenuList>
        )}
      </Menu>
    );
  }
}

export default withRouter( Dropdown );
