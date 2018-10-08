import React, { Component, isValidElement } from 'react';
import { object, array } from 'prop-types';
import { isArray } from '../../../utils';
import { Recursive } from '../../components';

class Selection extends Component {
  static propTypes = {
    context: object,
    children: array,
  }

  state = {
    selected: null,
    // selectedArray: [],
  }

  handleSelect = selected => () => {
    this.setState({ selected });
  }

  render() {
    const { children } = this.props;
    const { selected } = this.state;

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
          selection: {
            onSelect: this.handleSelect( index ),
            isSelected: selected === index,
          },
        }}
      />
    ));
  }
}

export default Selection;
