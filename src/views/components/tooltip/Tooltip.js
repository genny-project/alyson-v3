import React, { Component } from 'react';
import { string, integer, node, oneOf, oneOfType, object, func } from 'prop-types';
// import debounce from 'lodash.debounce';
import { Box, Text, Fragment } from '../../components';

var timeoutID;

class Tooltip extends Component {
  static defaultProps = {
    text: 'test-id',
    debounce: 300,
    top: 0 ,
    left: '-50%',
    position: 'absolute',
    zIndex: 100,
    transform: 'translate(-50%)',
    containerProps: {
      backgroundColor: '#fff',
      padding: 5,
    },
  }

  static propTypes = {
    children: node,
    text: string,
    debounce: integer,
    top: oneOfType( [
      integer, string,
    ] ),
    left: oneOfType( [
      integer, string,
    ] ),
    position: oneOf( [
      'absolute', 'fixed',
    ] ),
    zIndex: integer,
    transform: string,
    containerProps: object,
    onMouseOver: func,
    onMouseOut: func,
  }

  state = {
    isOpen: false,
  }

  handleMouseOverDebounced = () => {
    timeoutID = window.setTimeout(
      () => {
        this.handleMouseOver();
      },
      this.props.debounce,
    );
  }

  handleMouseOver = () => {
    this.setState({
      isOpen: true,
    }, () => {
      if ( this.props.onMouseOver ) this.props.onMouseOver();
    });
  }

  handleMouseOut = () => {
    window.clearTimeout( timeoutID );
    this.setState({
      isOpen: false,
    }, () => {
      if ( this.props.onMouseOut ) this.props.onMouseOut();
    });
  }

  render() {
    const {
      children,
      text,
      position,
      top,
      left,
      zIndex,
      transform,
      containerProps,
    } = this.props;
    const { isOpen  } = this.state;

    // console.log( this.props );

    return (
      <Fragment>
        {
          isOpen
            ? (
              <Box
                position={position}
                top={top}
                left={left}
                transform={transform}
                zIndex={zIndex}
                {...containerProps}
              >
                <Text
                  size="xxs"
                  text={text}
                />
              </Box>
            ) : null
        }
        {
          React.Children.map( children, child => (
            React.cloneElement( child, {
              ...child.props,
              onMouseOver: this.handleMouseOverDebounced,
              onMouseOut: this.handleMouseOut,
            })
          ))
        }
      </Fragment>
    );
  }
}

export default Tooltip;
