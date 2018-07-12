/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { node } from 'prop-types';
import config from '../../../config';
import { store } from '../../../redux';
import * as actions from '../../../redux/actions';
import LayoutContext from '../context';

class LayoutProvider extends Component {
  static propTypes = {
    children: node,
  }

  /* eslint-disable react/sort-comp */

  setAppColor = color => {
    const appColor = this.appColors[color] || color;
    const textColor = this.textColors[color] || color;

    if ( appColor )
      this.setState({
        appColor,
        textColor,
      });
    else {
      const colors = Object.keys( this.appColors ).join( '|' );

      console.warn( `Invalid app color '${color}' was set, expected one of the following: ${colors}` );
    }
  }

  setBackgroundColor = color => {
    const backgroundColor = this.backgroundColors[color] || color;

    if ( !backgroundColor )
      this.setState({ backgroundColor });
    else {
      const colors = Object.keys( color ).join( '|' );

      console.warn( `Invalid background color '${color}' was set, expected one of the following: ${colors}` );
    }
  }

  setSidebarVisibility = visible => {
    this.setState({ hideSidebar: visible });

    store.dispatch(
      actions.setSidebarVisibility( visible )
    );
  }

  setHeaderVisibility = visible => {
    this.setState({ hideHeader: visible });

    store.dispatch(
      actions.setHeaderVisibility( visible )
    );
  }

  setHeaderProps = props => {
    this.setState({ headerProps: props || {} });

    store.dispatch(
      actions.setHeaderProps( props || {})
    );
  }

  setTitle = title => {
    this.setState({ title });
  }

  appColors = {
    light: '#FFF',
    dark: '#232323',
  }

  textColors = {
    light: '#000',
    dark: '#FFF',
  }

  backgroundColors = {
    white: '#FFF',
    grey: '#fafafa',
  }

  /* eslint-enable react/sort-comp */

  state = {
    appColor: this.appColors.dark,
    textColor: this.textColors.dark,
    backgroundColor: this.backgroundColors.grey,
    title: config.app.name,
    setBackgroundColor: this.setBackgroundColor,
    setAppColor: this.setAppColor,
    setTitle: this.setTitle,
    setSidebarVisibility: this.setSidebarVisibility,
    setHeaderVisibility: this.setHeaderVisibility,
    setHeaderProps: this.setHeaderProps,
    hideSidebar: false,
    showHeader: false,
    headerProps: {},
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
