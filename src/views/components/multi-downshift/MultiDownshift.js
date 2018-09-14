/**
 * Author: https://codesandbox.io/s/github/kentcdodds/downshift-examples/tree/master/?module=%2Fsrc%2Fordered-examples%2F04-multi-select.js&moduleview=1
 */

import React from 'react';
import Downshift from 'downshift';
import { func, array } from 'prop-types';

class MultiDownshift extends React.Component {
  static propTypes = {
    onChange: func,
    onSelect: func,
    render: func,
    children: func,
    selectedItems: array,
  }

  state = { selectedItems: [] }

  componentDidMount() {
    this.populateSelectedItems();
  }

  componentDidUpdate( prevProps ) {
    if ( prevProps.selectedItems !== this.props.selectedItems ) {
      this.populateSelectedItems();
    }
  }

  getRemoveButtonProps = ({ onPress, item, ...props } = {}) => {
    return {
      onPress: e => {
        // TODO: use something like downshift's composeEventHandlers utility instead
        onPress && onPress( e );
        e.stopPropagation();
        this.removeItem( item );
      },
      ...props,
    };
  }

  getStateAndHelpers( downshift ) {
    const { selectedItems } = this.state;
    const { getRemoveButtonProps, removeItem } = this;

    return {
      getRemoveButtonProps,
      removeItem,
      selectedItems,
      ...downshift,
    };
  }

  populateSelectedItems = () => {
    if ( this.props.selectedItems ) {
      this.setState({
        selectedItems: this.props.selectedItems,
      });
    }
  }

  stateReducer = ( state, changes ) => {
    switch ( changes.type ) {
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
        return {
          ...changes,
          highlightedIndex: state.highlightedIndex,
          isOpen: true,
        };
      default:
        return changes;
    }
  }

  handleSelection = ( selectedItem, downshift ) => {
    const callOnChange = () => {
      if ( this.props.onSelect ) {
        this.props.onSelect(
          this.state.selectedItems,
          this.getStateAndHelpers( downshift ),
        );
      }
      if ( this.props.onChange ) {
        this.props.onChange(
          this.state.selectedItems,
          this.getStateAndHelpers( downshift ),
        );
      }
    };

    if ( this.state.selectedItems.includes( selectedItem )) {
      this.removeItem( selectedItem, callOnChange );
    } else {
      this.addSelectedItem( selectedItem, callOnChange );
    }
  }

  removeItem = ( item, cb ) => {
    this.setState(({ selectedItems }) => {
      return {
        selectedItems: selectedItems.filter( i => i !== item ),
      };
    }, cb );
  }

  addSelectedItem( item, cb ) {
    this.setState(
      ({ selectedItems }) => ({
        selectedItems: [...selectedItems, item],
      }),
      cb,
    );
  }

  render() {
    const { render, children = render, ...props } = this.props;

    // TODO: compose together props (rather than overwriting them) like downshift does
    return (
      <Downshift
        {...props}
        stateReducer={this.stateReducer}
        onChange={this.handleSelection}
        selectedItem={null}
      >
        {downshift => children( this.getStateAndHelpers( downshift ))}
      </Downshift>
    );
  }
}

export default MultiDownshift;
