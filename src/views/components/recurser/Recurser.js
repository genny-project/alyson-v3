/* eslint-disable */

import React, { Component } from 'react';
import { object, array } from 'prop-types';
import { connect } from 'react-redux';
import dlv from 'dlv';
import { Fragment, Frame, Text, Form } from '../index';
import { isArray, isString, isObject, sort } from '../../../utils';

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
        { sort( children, { paths: ["weight", "created"], direction: 'desc' }).map( child => {
          const baseEntityCode = child.code;
          const linkType = child.type;

          if ( linkType === 'ask' ) {
            return (
              <Form
                inheritedThemes={themes}
                key={baseEntityCode}
                questionGroupCode={baseEntityCode}
              />
            );
          }

          if ( linkType === 'frame' ) {
            return (
              <Frame
                key={baseEntityCode}
                rootCode={baseEntityCode}
                inheritedThemes={themes}
              />
            );
          }

          return (
            <Text
              {...themes}
              key={baseEntityCode}
              text={baseEntityCode}
            />
          );
        })}
      </Fragment>

    );
  }
}

export default Recurser;
