import React, { Component } from 'react';
import { array, number } from 'prop-types';
import { Icon, Box } from '../../components';

class ProgressNode extends Component {
  static propTypes = {
    items: array,
    selectedItemIndex: number,
  };

  static defaultProps = {
    items: ['Internship', 'Applied', 'Placed', 'Interviewed'],
    selectedItemIndex: 3,
  };

  createNodesBasedOnItems = () => {
    const { items,selectedItemIndex } = this.props;
    const nodes = items.map(( item,i ) => {
      return (
        <Box
          key={items.key}
        >
          <Box
            height="40px"
            width="4px"
            backgroundColor="white"
            zIndex={-10}
          />
          
          {i === selectedItemIndex ? (
            <Box
              position="relative"
              left={-19}
              top={5}
            >
              <Icon
                name="far fa-circle"
                color="white"
                iconType="font-awesome"
                size="lg"
              />
            </Box>
          ) : (
            <Box
              position="relative"
              left={-14}
            >
              <Icon
                name="fas fa-circle"
                color="white"
                iconType="font-awesome"
                size="md"
              />
            </Box>
          )}

          <span style={{ textAlign: 'left', color: '#fff' }}>
            {item.text}
          </span>
        </Box> );}
    );

    return nodes;
  };

  render() {
    return (
      <div>
        {this.createNodesBasedOnItems()}
      </div>
    );
  }
}

export default ProgressNode;
