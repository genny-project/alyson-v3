import React, { Component, isValidElement } from 'react';
import { object, array, bool, func, string, any, shape } from 'prop-types';
import { isArray } from '../../../utils';
import { Recursive, Touchable } from '..';

class Selectable extends Component {
  static defaultProps = {
  }

  static propTypes = {
    context: object,
    children: array,
    selectFirstItemOnMount: bool,
    dispatchActionOnChange: shape({
      type: string.isRequired,
      payload: any,
    }),
    onChange: func,
    item: any,
    onPress: func,
  }

  // componentDidMount() {
  //   if ( this.props.selectFirstItemOnMount )
  //     this.selectFirstItem();
  // }

  // componentDidUpdate( prevProps, prevState ) {
  //   if (
  //     this.props.selectFirstItemOnMount &&
  //     !this.state.selectedFirstItemOnMount
  //   ) {
  //     this.selectFirstItem();
  //   }

  //   if ( prevState.selectedIndex !== this.state.selectedIndex ) {
  //     const { dispatchActionOnChange } = this.props;
  //     const { selectedItem, selectedIndex } = this.state;

  //     if ( dispatchActionOnChange ) {
  //       store.dispatch(
  //         injectDataIntoProps(
  //           dispatchActionOnChange,
  //           isValidElement( selectedItem )
  //             ? selectedItem.props
  //             : selectedItem
  //         )
  //       );
  //     }

  //     if ( this.props.onChange )
  //       this.props.onChange( selectedIndex );
  //   }
  // }

  // handleSelect = ( selectedIndex, item ) => () => {
  //   const { mode } = this.props;

  //   switch ( mode ) {
  //     case 'single': {
  //       this.setState({ selectedIndex, selectedItem: item });
  //       break;
  //     }

  //     case 'toggle': {
  //       if ( this.state.selected === selectedIndex ) {
  //         this.setState({ selectedIndex: null, selectedItem: null });
  //       }
  //       else {
  //         this.setState({ selectedIndex, selectedItem: item });
  //       }
  //       break;
  //     }

  //     default: break;
  //   }
  // }

  // selectFirstItem() {
  //   const { children } = this.props;

  //   if ( isArray( children, { ofMinLength: 1 })) {
  //     this.handleSelect( 0, children[0] )();
  //     this.setState({ selectedFirstItemOnMount: true });
  //   }
  // }

  render() {
    const { children, onPress, item } = this.props;
    // const { selectedIndex } = this.state;

    console.log( this.props );

    if ( !isArray( children )) {
      if ( isValidElement )
        return children;

      return (
        <Recursive {...children} />
      );
    }

    console.log( 'array' );

    return children.map(( child, index ) => (
      <Touchable
        key={index} // eslint-disable-line react/no-array-index-key
        withFeedback
        onPress={onPress ? () => onPress( item, true  ) : null}
      >
        <Recursive
          {...child.props}
          context={{
            ...child.props.context,
          }}
        />
      </Touchable>
    ));
  }
}

export default Selectable;
