/**
 * Author: https://codesandbox.io/s/github/kentcdodds/downshift-examples/tree/master/?module=%2Fsrc%2Fordered-examples%2F04-multi-select.js&moduleview=1
 */

import React from 'react';
import Downshift from 'downshift';
import { func, array, bool } from 'prop-types';
import shallowCompare from '../../../utils/shallow-compare';

class MultiDownshift extends React.Component {
  static propTypes = {
    onChange: func,
    onSelect: func,
    render: func,
    children: func,
    selectedItems: array,
    addItemFunction: func,
    removeItemFunction: func,
    allowMultipleSelection: bool,
  }

  state = {
    selectedItems: [],
    isOpen: false,
  }

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
    const { getRemoveButtonProps, removeItem, selectMultipleItems, handleToggleMenu } = this;

    return {
      getRemoveButtonProps: getRemoveButtonProps( downshift ),
      removeItem,
      selectedItems,
      selectMultipleItems: selectMultipleItems( downshift ),
      handleToggleMenu,
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

  removeItem = ( item, downshift ) => {
    const { removeItemFunction } = this.props;

    if ( item != null ) {
      this.setState(({ selectedItems }) => {
        return {
          selectedItems: removeItemFunction
            ? removeItemFunction( selectedItems, item )
            : selectedItems.filter( i => shallowCompare( i, item )),
        };
      }, () => {
        this.callOnChange( downshift );
      });
    }
  }

  selectMultipleItems = ( downshift ) => ( items ) => {
    this.setState(({
      selectedItems: items,
    }), () => {
      this.callOnChange( downshift );
    });
  }

  addSelectedItem( item, downshift ) {
    const { addItemFunction } = this.props;

    this.setState(
      ({ selectedItems }) => ({
        selectedItems: addItemFunction
          ? addItemFunction( selectedItems, item )
          : selectedItems.filter( i => shallowCompare( i, item )).length === 0
            ? [...selectedItems, item]
            : selectedItems,
      }), () => {
        this.callOnChange( downshift );
      }
    );
  }

  handleToggleMenu = () => {
    this.setState(
      ({ isOpen }) => {
        return {
          isOpen: !isOpen,
        };
      });
  }

  handleSelection = ( selectedItem, downshift ) => {
    this.addSelectedItem( selectedItem, downshift );
  }

  render() {
    const { render, children = render, ...props } = this.props;
    const { isOpen } = this.state;

    return (
      <Downshift
        {...props}
        isOpen={isOpen}
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
