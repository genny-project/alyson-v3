import React, { Component, isValidElement } from 'react';
import { object, array, string } from 'prop-types';
import { isArray, Bridge } from '../../../utils';
import { Recursive } from '..';

class Pagination extends Component {
  static defaultProps = {
  }

  static propTypes = {
    context: object,
    children: array,
    code: string.isRequired,
  }

  state = {
    currentPage: 0,
  }

  handleScrollForMore = ( event ) => {
    console.log( 'scrolling' );
    const { target } = event;

    if ( !target ) return null;

    const { scrollHeight, scrollTop, clientHeight } = target;

    if ( !scrollHeight || !scrollTop || !clientHeight ) return null;

    const isBottom = scrollHeight - scrollTop === clientHeight;

    if ( isBottom ) {
      const value = {
        pageSize: 10,
        pageIndex: this.state.currentPage,
      };

      const valueString = (
        value &&
        typeof value === 'string'
      )
        ? value
        : JSON.stringify( value );

      Bridge.sendEvent({
        event: 'PAGINATION',
        sendWithToken: true,
        data: {
          code: this.props.code || null,
          value: valueString || null,
        },
      });

      this.setState( state => ({
        currentPage: state.currentPage + 1,
      }));
    }
  }

  render() {
    const { children } = this.props;

    if ( !isArray( children )) {
      if ( isValidElement )
        return children;

      return (
        <Recursive {...children} />
      );
    }

    return children.map(( child, index ) => (
      <Recursive
        {...child.props}
        key={index} // eslint-disable-line react/no-array-index-key
        context={{
          ...child.props.context,
          onScroll: this.handleScrollForMore,

        }}
      />
    ));
  }
}

export default Pagination;
