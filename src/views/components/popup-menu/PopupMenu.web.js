/*

TODO:

Implement for web

*/

import { Component } from 'react';
import { array, func } from 'prop-types';

class PopupMenu extends Component {
  static propTypes = {
    items: array.isRequired, // eslint-disable-line react/no-unused-prop-types
    children: func,
  }

  handleSetAnchorRef = () => {}
  handleShowPopupMenu = () => {}

  render() {
    return this.props.children({
      showPopupMenu: this.handleShowPopupMenu,
      setAnchorRef: this.handleSetAnchorRef,
    });
  }
}

export default PopupMenu;
