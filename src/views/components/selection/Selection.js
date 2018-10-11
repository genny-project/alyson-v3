import React, { Component, isValidElement } from 'react';
import { object, array, oneOf } from 'prop-types';
import { isArray } from '../../../utils';
import { Recursive } from '../../components';

class Selection extends Component {
  static defaultProps = {
    mode: 'single',
  }

  static propTypes = {
    context: object,
    children: array,
    mode: oneOf( ['single','toggle'] ),
  }

  state = {
    selected: null,
    // selectedArray: [],
  }

  handleSelect = selected => () => {
    const { mode } = this.props;

    switch ( mode ) {
      case 'single': {
        this.setState({ selected });
        break;
      }

      case 'toggle': {
        if ( this.state.selected === selected ) {
          this.setState({ selected: null });
        }
        else {
          this.setState({ selected });
        }
        break;
      }

      default: break;
    }
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
