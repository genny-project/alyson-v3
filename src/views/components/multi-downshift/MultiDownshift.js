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

  getRemoveButtonProps = downshift => ({ onPress, item, ...props } = {}) => {
    return {
      onPress: e => {
        // TODO: use something like downshift's composeEventHandlers utility instead
        onPress && onPress( e );
        e.stopPropagation();
        this.removeItem( item, downshift );
      },
      ...props,
    };
  }

  getStateAndHelpers( downshift ) {
    const { selectedItems } = this.state;
    const { getRemoveButtonProps, removeItem } = this;

    return {
      getRemoveButtonProps: getRemoveButtonProps( downshift ),
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

  callOnChange = ( downshift ) => {
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

  handleSelection = ( selectedItem, downshift ) => {
    // if ( this.state.selectedItems.includes( selectedItem )) {
    //   this.removeItem( selectedItem );
    // } else {
    this.addSelectedItem( selectedItem, downshift );
    // }
  }

  removeItem = ( item, downshift ) => {
    if (
      item != null &&
      this.state.selectedItems !== this.state.selectedItems.filter( i => i !== item )
    ) {
      this.setState(({ selectedItems }) => {
        return {
          selectedItems: selectedItems.filter( i => i !== item ),
        };
      }, () => {
        this.callOnChange( downshift );
      });
    }
  }

  addSelectedItem( item, downshift ) {
    this.setState(
      ({ selectedItems }) => ({
        selectedItems: [...selectedItems, item],
      }), () => {
        this.callOnChange( downshift );
      }
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
