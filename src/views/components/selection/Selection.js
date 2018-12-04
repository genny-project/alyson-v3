import React, { Component, isValidElement } from 'react';
import { object, array, oneOf, bool, func, string, any, shape } from 'prop-types';
import { isArray, injectDataIntoProps } from '../../../utils';
import { store } from '../../../redux';
import { Recursive } from '../../components';

class Selection extends Component {
  static defaultProps = {
    mode: 'single',
    useSelectableComponents: false,
  }

  static propTypes = {
    context: object,
    children: array,
    mode: oneOf( ['single','toggle'] ),
    selectFirstItemOnMount: bool,
    dispatchActionOnChange: shape({
      type: string.isRequired,
      payload: any,
    }),
    onChange: func,
    useSelectableComponents: bool,
  }

  state = {
    selectedIndex: null,
    selectedItem: null,
    selectedFirstItemOnMount: false,
  }

  componentDidMount() {
    if ( this.props.selectFirstItemOnMount )
      this.selectFirstItem();
  }

  componentDidUpdate( prevProps, prevState ) {
    if (
      this.props.selectFirstItemOnMount &&
      !this.state.selectedFirstItemOnMount
    ) {
      this.selectFirstItem();
    }

    if ( prevState.selectedIndex !== this.state.selectedIndex ) {
      const { dispatchActionOnChange } = this.props;
      const { selectedItem, selectedIndex } = this.state;

      if ( dispatchActionOnChange ) {
        store.dispatch(
          injectDataIntoProps(
            dispatchActionOnChange,
            isValidElement( selectedItem )
              ? selectedItem.props
              : selectedItem
          )
        );
      }

      if ( this.props.onChange )
        this.props.onChange( selectedIndex );
    }
  }

  handleSelectableSelect = ( id, item ) => {
    this.selectItem( id, item );
  }

  handleChildSelect = ( selectedIndex, item ) => () => {
    this.selectItem( selectedIndex, item );
  }

  selectItem = ( selectedIndex, item ) => {
    const { mode, useSelectableComponents } = this.props;

    switch ( mode ) {
      case 'single': {
        this.setState({ selectedIndex, selectedItem: item });
        break;
      }

      case 'toggle': {
        if (
          ( useSelectableComponents
            ? this.state.selectedIndex
            : this.state.selected ) === selectedIndex
        ) {
          this.setState({ selectedIndex: null, selectedItem: null });
        }
        else {
          this.setState({ selectedIndex, selectedItem: item });
        }
        break;
      }

      default: break;
    }
  }

  selectFirstItem = () => {
    const { children } = this.props;

    if ( isArray( children, { ofMinLength: 1 })) {
      this.selectItem( 0, children[0] )();
      this.setState({ selectedFirstItemOnMount: true });
    }
  }

  render() {
    const { children, useSelectableComponents } = this.props;
    const { selectedIndex } = this.state;

    /**
     * TODO: Make this component much safer to use and more versatile
     */

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
          ...useSelectableComponents
            ? {
              selection: {
                onSelect: this.handleSelectableSelect,
                selectedItem: selectedIndex,
              },
            }
            : {
              selection: {
                onSelect: this.handleChildSelect( index, child ),
                isSelected: selectedIndex === index,
              },
            },
        }}
      />
    ));
  }
}

export default Selection;
