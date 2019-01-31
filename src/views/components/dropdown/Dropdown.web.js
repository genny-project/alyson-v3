import React, { Component, isValidElement } from 'react';
import { array, bool, object, any, string } from 'prop-types';
import { Menu, MenuButton, MenuItem, MenuList, MenuLink } from '@reach/menu-button';
import { withRouter } from 'react-router-dom';
import { isArray, isString, Bridge } from '../../../utils';
import { Recursive, Text, TestIdTooltip } from '../../components';
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
    const buttonTestId = `dropdown ${testID}`;

    return (
      <Menu>
        <TestIdTooltip
          id={buttonTestId}
        >
          <MenuButton
            disabled={disabled || !isArray( items, { ofMinLength: 1 })}
            style={menuButtonStyle}
            data-testID={buttonTestId}
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
        </TestIdTooltip>

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
              const itemTestId = `dropdown-item ${item.id || item.buttonCode}`;

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
                          : <Recursive key={i} {...item} context={context} /> // eslint-disable-line
                    ))
                    : <Recursive {...renderItem} context={context} /> // eslint-disable-line
                );

                if ( item.href ) {
                  return (
                    <MenuLink
                      key={item.text}
                      data-testID={itemTestId}
                      to={(
                        item.href === 'home' ? '/'
                        : item.href.startsWith( '/' ) ? item.href
                        : `/${item.href}`
                      )}
                      onClick={this.handleNavigate( item )}
                    >
                      <TestIdTooltip
                        id={itemTestId}
                      >
                        {child}
                      </TestIdTooltip>
                    </MenuLink>
                  );
                }

                return (
                  <MenuItem
                    key={item.text}
                    data-testID={itemTestId}
                    onSelect={this.handleSelect( item )}
                  >
                    <TestIdTooltip
                      id={itemTestId}
                    >
                      {child}
                    </TestIdTooltip>
                  </MenuItem>
                );
              }

              if ( item.href ) {
                return (
                  <MenuLink
                    key={item.text}
                    data-testID={itemTestId}
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
                    <TestIdTooltip
                      id={itemTestId}
                    >
                      <Text
                        text={item.text}
                        {...{
                          ...menuItemStyle,
                          ...menuLinkStyle,
                        }}
                      />
                    </TestIdTooltip>
                  </MenuLink>
                );
              }

              return (
                <MenuItem
                  key={item.text}
                  style={menuItemStyle}
                  data-testID={itemTestId}
                  onSelect={this.handleSelect( item )}
                >
                  <TestIdTooltip
                    id={itemTestId}
                  >
                    {
                      isValidElement( item.children )
                        ? item.children
                        : isString( item.text )
                          ? (
                            <Text
                              {...menuItemStyle}
                              text={item.text}
                            />
                          ) : isArray( item.children )
                            ? item.children.map(( child, i ) => (
                              isValidElement( child )
                                ? child
                                : <Recursive key={i} {...child} /> // eslint-disable-line
                            ))
                            : <Recursive {...item.children} />
                    }
                  </TestIdTooltip>
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
