/* eslint-disable */

import React, { Component } from 'react';
import { object, array } from 'prop-types';
import { connect } from 'react-redux';
import { Fragment, Frame, Text, Form } from '../index';
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
          console.log( linkType, baseEntityCode );

          if ( linkType === 'ask' ) {
            return (
              <Form
                // {...themes}
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
