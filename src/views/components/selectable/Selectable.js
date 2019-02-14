import React, { Component, isValidElement } from 'react';
import { object, array, string, any } from 'prop-types';
import { isArray } from '../../../utils';
import { EventButton } from '..';

class Selectable extends Component {
  static defaultProps = {
  }

  static propTypes = {
    context: object,
    selectionProps: object.isRequired,
    children: array,
    id: string.isRequired,
    item: any.isRequired,
  }

  handlePress = () => {
    const { selectionProps, id, item } = this.props;
    const { onSelect } = selectionProps;

    if ( onSelect ) onSelect( id, item );
  }

  render() {
    const { children, selectionProps, id, ...restProps } = this.props;

    if ( !isArray( children )) {
      if ( !isValidElement )
        return null;

      return children;
    }

    return children.map(( child, index ) => (
      <EventButton
        {...restProps}
        key={index} // eslint-disable-line react/no-array-index-key
        onPress={this.handlePress}
      >
        {React.cloneElement( child, {
          ...child.props,
          selectable: {
            isSelected: selectionProps.selectedItem === id,
          },
        })}
      </EventButton>
    ));
  }
}

export default Selectable;
