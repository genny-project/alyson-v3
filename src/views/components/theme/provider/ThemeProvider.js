/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { node } from 'prop-types';
import ThemeContext from '../context';

class ThemeProvider extends Component {
  static propTypes = {
    children: node,
  }

  /* eslint-disable react/sort-comp */

  addComponentConfig = ( componentName, config ) => {
    this.addComponentTheme( componentName, 'config', config );
  }

  addComponentTheme = ( componentName, themeName, theme ) => {
    this.setState( state => ({
      components: {
        ...state.components,
        [componentName]: {
          ...state.components[componentName],
          [themeName]: theme,
        },
      },
    }));
  }

  /* eslint-enable react/sort-comp */

  state = {
    components: {},
    addComponentTheme: this.addComponentTheme,
    addComponentConfig: this.addComponentConfig,
  }

  render() {
    return (
      <ThemeContext.Provider value={this.state}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

export default ThemeProvider;
