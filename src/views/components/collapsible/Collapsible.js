import React, { Component } from 'react';
import { any, bool, func } from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { Box, Icon }  from '../../components';

class Collapsible extends Component {
  static defaultProps = {
    showHeader: true,
    open: false,
  }

  static propTypes = {
    children: any,
    showHeader: bool,
    header: any,
    open: bool,
    onToggle: func,
  }

  static getDerivedStateFromProps( nextProps, nextState ) {
    if (
      nextProps.open != null &&
      nextProps.open !== nextState.open
    ) {
      return { isOpen: nextProps.open };
    }

    return null;
  }

  state = {
    isOpen: this.props.open,
  }

  handlePress = () => {
    this.setState( state => ({ isOpen: !state.isOpen }));
    if ( this.props.onToggle ) this.props.onToggle();
  }

  render() {
    const {
      children,
      showHeader,
      header,
    } = this.props;

    const { isOpen } = this.state;

    return (
      <Box
        justifyContent="center"
        flexDirection="column"
      >
        {showHeader ? (
          <TouchableOpacity
            onPress={this.handlePress}
          >
            {
              header ?
                header : (
                  <Box
                    justifyContent="center"
                    transform={[
                      { rotate: isOpen ? '180deg' : '0deg' },
                    ]}
                  >
                    <Icon
                      name="keyboard_arrow_down"
                      color="black"
                    />
                  </Box>
                )
            }
          </TouchableOpacity>
        ) : null}
        {isOpen ? (
          children
        ) : null}
      </Box>
    );
  }
}

export default Collapsible;