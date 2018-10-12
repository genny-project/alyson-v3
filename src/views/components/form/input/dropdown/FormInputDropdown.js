import React, { Component } from 'react';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import { Input } from '../../../index';

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

    console.log( 'Getting items', validationList );

    if (
      validationList &&
      validationList instanceof Array &&
      validationList.length > 0
    ) {
      validationList.forEach( validation => {
        console.log( 'new validation: ', validation );
        if (
          validation.selectionBaseEntityGroupList &&
          validation.selectionBaseEntityGroupList instanceof Array &&
          validation.selectionBaseEntityGroupList.length > 0
        ) {
          validation.selectionBaseEntityGroupList.forEach( baseEntity => {
            console.log( 'getting baseEntities: ', baseEntity );
            const linkGroup = links[baseEntity];

            console.log( linkGroup );

            if (
              linkGroup &&
              linkGroup.links &&
              linkGroup.links instanceof Array &&
              linkGroup.links.length > 0
            ) {
              linkGroup.links.forEach( link => {
                const linkData = data[link];

                console.log( linkData );

                if (
                  linkData &&
                  linkData.name
                ) {
                  items.push({
                    label: linkData.name,
                    value: linkData.code,
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
    const { items } = this.state;

    console.log( items );

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
