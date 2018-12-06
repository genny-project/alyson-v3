import React, { Component } from 'react';
import { connect } from 'react-redux';
import { string, number, object, bool } from 'prop-types';
import { Dimensions } from 'react-native';
import dlv from 'dlv';

import { Image } from '../';

class ImageProxy extends Component {
    static defaultProps = {
      maxmimumRetries: 3,
      imageProxyKey: 'PRI_IMAGE_PROXY_URL',
      imageWidth: '',
      imageHeight: '',
      rotation: 0,
      quality: 80,
      fit: true,
      screenWidth: false,
      screenHeight: false,
    }

    static propTypes = {
      source: string,
      maxmimumRetries: number,
      imageProxyKey: string,
      vertx: object,
      imageWidth: number,
      imageHeight: number,
      quality: number,
      rotation: number,
      fit: bool,
      flipX: bool,
      flipY: bool,
      screenWidth: bool,
      screenHeight: bool,
    }

    state = {
      proxyURL: null,
      interval: null,
      attempts: 0,
    }

    componentDidMount() {
      const proxyURL =  this.checkForProxyURL();

      this.setState({ proxyURL });

      if ( !proxyURL ) {
        const interval = setInterval(() => {
          const { attempts, proxyURL, interval } = this.state;

          if ( attempts > this.props.maxmimumRetries || proxyURL ) {
            clearInterval( interval );

            return;
          }

          const imageProxyURLAttempt = this.checkForProxyURL();

          this.setState( state => ({
            ...state,
            attempts: state.attempts += 1,
            proxyURL: imageProxyURLAttempt,
          }));
        }, 5000 );

        this.setState({ interval });
      }
    }

  checkForProxyURL = () => {
    const { vertx, imageProxyKey } = this.props;
    const project = vertx.aliases.PROJECT;

    return dlv( vertx.baseEntities.attributes, [project, imageProxyKey, 'value'] );
  }

  buildOptions = () => {
    const {
      imageWidth, imageHeight, quality,
      flipY, flipX, screenWidth, screenHeight, fit,
      rotation,
    } = this.props;

    const options = [];

    if ( screenWidth || screenHeight ) {
      const { width, height } = Dimensions.get( 'window' );

      const newWidth = ( screenWidth && width ) || imageWidth;
      const newHeight = ( screenHeight && height ) || imageHeight;

      // eslint-disable-next-line no-console
      console.warn( `${newWidth}${newWidth && newHeight ? 'x' : ''}${newHeight}` );

      options.push( `${newWidth}${newWidth && newHeight ? 'x' : ''}${newHeight}` );
    }

    if ( quality )
      options.push( `q${quality}` );

    if ( flipY )
      options.push( 'fv' );

    if ( flipX )
      options.push( 'fh' );

    if ( fit )
      options.push( 'fit' );

    if ( rotation )
      options.push( `r${rotation}` );

    return options.join();
  }

  render() {
    const { proxyURL } = this.state;
    const {
      source,
      ...restProps
    } = this.props;

    return (
      proxyURL
        ? (
          <Image
            {...restProps}
            source={`${proxyURL}/${this.buildOptions()}/${source}`}
          />
        )
        : (
          <Image
            {...restProps}
            source={source}
          />

        ));
  }
}

export { ImageProxy };

const mapStateToProps = state => ({
  vertx: state.vertx,
});

export default connect( mapStateToProps )( ImageProxy );
