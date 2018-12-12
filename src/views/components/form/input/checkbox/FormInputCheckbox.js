import React, { Component } from 'react';
import { object, oneOfType, string, array } from 'prop-types';
import { connect } from 'react-redux';
import dlv from 'dlv';
import { isArray, isString, isObject } from '../../../../../utils';
import { Input } from '../../../index';

class FormInputCheckbox extends Component {
  static propTypes = {
    question: object,
    baseEntities: object,
    value: oneOfType(
      [string, array]
    ),
  }

  state = {
    items: [],
    value: [],
  }

  componentDidMount() {
    this.getItems();
    this.getValue();
  }

  componentDidUpdate( prevProps, prevState ) {
    if ( prevState.items.length === 0 )
      this.getItems();

    if ( this.props.value !== prevProps.value ) {
      this.getValue();
    }
  }

  getValue() {
    const { value } = this.props;

    if ( isString( value )) {
      let parsed = null;

      try {
        parsed = JSON.parse( value );
      }
      catch ( e ) {
        // eslint-disable-next-line no-console
        console.warn( 'Unable to parse value in FormInputCheckbox', e );
      }

      if ( parsed ) {
        this.setState({ value: parsed });
      }
    }
    else if ( isArray( value )) {
      this.setState({ value });
    }
  }

  getItems() {
    const { data, links } = this.props.baseEntities;
    const { validationList } = this.props.question.attribute.dataType;
    const items = [];

    if (
      validationList &&
      validationList instanceof Array &&
      validationList.length > 0
    ) {
      validationList.forEach( validation => {
        if (
          validation.selectionBaseEntityGroupList &&
          validation.selectionBaseEntityGroupList instanceof Array &&
          validation.selectionBaseEntityGroupList.length > 0
        ) {
          validation.selectionBaseEntityGroupList.forEach( baseEntity => {
            const linkGroup = links[baseEntity];

            if (
              isObject( linkGroup )
            ) {
              const linkValues = Object.keys( linkGroup ).map( x => x );

              linkValues.forEach( linkValue => {
                if ( isArray( linkGroup[linkValue] )) {
                  linkGroup[linkValue].forEach( link => {
                    const baseEntity = dlv( data, link.link.targetCode );

                    if ( isObject( baseEntity )) {
                      items.push({
                        label: baseEntity.name,
                        value: baseEntity.code,
                        weight: link.weight || 1,
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }

    if ( items.length > 0 )
      this.setState({ items });
  }

  focus() {
    if (
      this.input &&
      this.input.focus
    ) {
      this.input.focus();
    }
  }

  render() {
    const { ...restProps } = this.props;
    const { items, value } = this.state;

    return (
      <Input
        {...restProps}
        items={items}
        ref={input => this.input = input}
        value={value}
      />
    );
  }
}

export { FormInputCheckbox };

const mapStateToProps = state => ({
  baseEntities: state.vertx.baseEntities,
});

export default connect( mapStateToProps )( FormInputCheckbox );
