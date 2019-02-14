/* eslint-disable */

import React, { Component } from 'react';
import { object, array } from 'prop-types';
import { connect } from 'react-redux';
import { Fragment, Frame, Text } from '../index';
import { isArray, isString, isObject } from '../../../utils';

class Recurser extends Component {
  static propTypes = {
    data: object,
    attributes: object,
    children: array,
  }

  state = {
  }

  render() {
    const { data, attributes, children, themes } = this.props;

    if ( !isArray( children, { ofMinLength: 1 })) {
      return null;
    }

    return (
      <Fragment>
        {children.map( child => {
          const baseEntityCode = child.code;
          const linkType = child.type;

          if ( linkType === 'ask' ) {
            return (
              <Text
                {...themes}
                key={baseEntityCode}
                text={baseEntityCode}
              />
            );
          }

          return (
            <Frame
              key={baseEntityCode}
              rootCode={baseEntityCode}
              inheritedThemes={themes}
            />
          );
        })}
      </Fragment>

    );
  }
}

export default Recurser;
