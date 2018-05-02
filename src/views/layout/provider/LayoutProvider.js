import React, { Component } from 'react';
import { node } from 'prop-types';
import config from '../../../config';
import LayoutContext from '../context';

class LayoutProvider extends Component {
  static propTypes = {
    children: node,
  }

  /* eslint-disable react/sort-comp */

  setAppColor = color => {
    const appColor = this.appColors[color];

    if ( appColor )
      this.setState({ appColor });
    else {
      const colors = Object.keys( this.appColors ).join( '|' );

      console.warn( `Invalid app color '${color}' was set, expected one of the following: ${colors}` );
    }
  }

  setBackgroundColor = color => {
    const backgroundColor = this.backgroundColors[color];

    if ( !backgroundColor )
      this.setState({ backgroundColor });
    else {
      const colors = Object.keys( color ).join( '|' );

      console.warn( `Invalid background color '${color}' was set, expected one of the following: ${colors}` );
    }
  }

  setTitle = title => {
    this.setState({ title });
  }

  appColors = {
    light: '#fafafa',
    dark: '#232323',
  }

  backgroundColors = {
    white: '#FFF',
    grey: '#fafafa',
  }

  /* eslint-enable react/sort-comp */

  state = {
    appColor: this.appColors.dark,
    backgroundColor: this.backgroundColors.grey,
    title: config.app.name,
    setBackgroundColor: this.setBackgroundColor,
    setAppColor: this.setAppColor,
    setTitle: this.setTitle,
  }

  render() {
    return (
      <LayoutContext.Provider value={this.state}>
        {this.props.children}
      </LayoutContext.Provider>
    );
  }
}

export default LayoutProvider;
