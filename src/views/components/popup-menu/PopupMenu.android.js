import { Component } from 'react';
import { UIManager, findNodeHandle } from 'react-native';
import { array, func } from 'prop-types';

class PopupMenu extends Component {
  static propTypes = {
    items: array.isRequired,
    children: func,
    onCancel: func,
    onSelect: func,
    deriveTextFromItems: func,
  }

  state = {
    anchorRef: null,
  }

  handleSetAnchorRef = ref => {
    this.setState({ anchorRef: ref });
  }

  handleShowPopupMenu = () => {
    const { items, deriveTextFromItems } = this.props;
    const { anchorRef } = this.state;

    UIManager.showPopupMenu(
      findNodeHandle( anchorRef ),
      deriveTextFromItems
        ? items.map( deriveTextFromItems )
        : items,
      this.handleCancel,
      this.handleSelect,
    );
  }

  handleSelect = ( eventName, selectedIndex ) => {
    const { items } = this.props;

    if (
      eventName === 'itemSelected' &&
      this.props.onSelect
    ) {
      const selectedItem = items[selectedIndex];

      this.props.onSelect( selectedItem );
    }
    else if ( eventName === 'dismissed' ) {
      this.handleCancel();
    }
  }

  handleCancel = event => {
    if ( this.props.onCancel )
      this.props.onCancel( event );
  }

  render() {
    return this.props.children({
      showPopupMenu: this.handleShowPopupMenu,
      setAnchorRef: this.handleSetAnchorRef,
    });
  }
}

export default PopupMenu;
