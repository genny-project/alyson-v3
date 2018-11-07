import React, { Component } from 'react';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import dlv from 'dlv';
import { Input } from '../../../index';
import { isArray, isObject } from '../../../../../utils';

class FormInputDropdown extends Component {
  static propTypes = {
    question: object,
    baseEntities: object,
  }

  state = {
    items: [],
  }

  componentDidMount() {
    this.getItems();
  }

  componentDidUpdate( prevProps, prevState ) {
    if ( prevState.items.length === 0 )
      this.getItems();
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

    if ( items.length > 0 ) {
      items.sort(( x, y ) => x.weight > y.weight ? 1 : -1 );
      this.setState({ items });
    }
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
    const { items } = this.state;

    return (
      <Input
        {...restProps}
        items={items}
        ref={input => this.input = input}
      />
    );
  }
}

export { FormInputDropdown };

const mapStateToProps = state => ({
  baseEntities: state.vertx.baseEntities,
});

export default connect( mapStateToProps )( FormInputDropdown );
