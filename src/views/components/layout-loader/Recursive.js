import React, { createElement, Component } from 'react';
import { Text } from 'react-native';
import dlv from 'dlv';
import copy from 'fast-copy';
import { connect } from 'react-redux';
import { object, any, string, array, oneOfType } from 'prop-types';
import { doesValueMatch } from '../../../utils/data-query/operators/find';
import { isObject, isArray, isString } from '../../../utils';
import { store } from '../../../redux';
import * as Components from '../index';

class Recursive extends Component {
  static propTypes = {
    component: string,
    props: object,
    children: any,
    context: any,
    repeat: any,
    onlyShowIf: object,
    dontShowIf: object,
    conditional: oneOfType( [object, array] ),
    variant: string,
    theme: object,
    useThemeFrom: string,
  };

  handleMapCurlyTemplate = template => {
    if ( !template || !template.includes( '}}' )) {
      return template;
    }

    const { context } = this.props;

    const splitTemplate = template.split( '}}' );
    const path = splitTemplate[0];

    const textAfterTemplate = splitTemplate.slice( 1 );
    const resolved = dlv( context, path );

    return `${resolved}${textAfterTemplate}`;
  };

  curlyBracketParse = string => {
    return String( string )
      .split( '{{' )
      .map( this.handleMapCurlyTemplate )
      .join( '' );
  };

  calculateConditionalProps = ( conditionalProps, context ) => {
    /* If no conditional props or no context is provided return an empty object */
    if ( !conditionalProps || !context ) {
      return {};
    }

    if ( isArray( conditionalProps )) {
      return this.calculateConditionalPropsArray( conditionalProps, context );
    }

    /* Check to make sure an if condition was provided */
    const ifCondition = conditionalProps.if;

    if ( !ifCondition ) {
      return {};
    }

    /* Get the "then" and "else" props */
    const thenProps = conditionalProps.then;
    const elseProps = conditionalProps.else;

    /**
     * Check whether the condition passes. We'll reuse the should
     * render component function for this. If the condition passes return the
     * "then" props, otherwise return the "else" props.
     */
    if ( this.ifConditionsPass( ifCondition )) {
      return thenProps;
    }

    return elseProps || {};
  };

  calculateConditionalPropsArray = ( conditionalProps, context ) => {
    /* If no conditional props or no context is provided return an empty object */
    if ( !conditionalProps || !context ) {
      return {};
    }

    return conditionalProps.reduce(( result, current ) => {
      const data = {
        ...result,
        ...this.calculateConditionalProps( current, context ),
      };

      return data;
    }, {});
  }

  handleReducePropInjection = ( result, current, index ) => {
    const { context } = this.props;

    if (
      result[current] == null &&
      result[index] == null
    ) {
      return result;
    }

    if ( isString( current, { startsWith: 'render' })) {
      return result;
    }

    if ( isString( result[current] )) {
      if ( result[current].startsWith( '_' )) {
        if ( result[current].includes( '{{' )) {
          result[current] = this.curlyBracketParse( result[current] );
        }

        result[current] = dlv( context, result[current].substring( 1 ));

        return result;
      }

      if ( result[current].includes( '{{' )) {
        result[current] = this.curlyBracketParse( result[current] );

        return result;
      }

      return result;
    }

    if ( isArray( result[current] )) {
      result[current] = result[current].reduce( this.handleReducePropInjection, result[current] );

      return result;
    }

    if ( isObject( result[current] ) || isObject( current )) {
      const targetObject = isObject( result[current] )  ? result[current] : current;
      const keys = Object.keys( targetObject );

      if ( result[current] ) {
        result[current] = keys.reduce( this.handleReducePropInjection, result[current] );
      } else {
        result[index] = keys.reduce( this.handleReducePropInjection, result[index] );
      }

      return result;
    }

    return result;
  };

  injectContextIntoChildren( context, children ) {
    return (
      isString( children ) &&
      children.indexOf( '{{' ) >= 0
    )
      ? this.curlyBracketParse( children )
      : children;
  }

  /**
   * Loops through all of the props for this element and inject the context if required.
   * Additionally parse a handlebars style string and inject variables from the context if needed.
   * If the prop is not a string, simply return its current value so that functions work
   * correctly.
   */
  injectContextIntoProps( props ) {
    if ( !isObject( props )) return {};

    const propsCopy = copy( props );
    let afterProps;

    try {
      afterProps = Object.keys( propsCopy ).reduce( this.handleReducePropInjection, propsCopy );
    } catch ( e ) {
      console.error( 'FOUND IT' );
    }

    return afterProps;
  }

  /* Determines whether or not we should render a component, used for onlyShowIf functionality */
  ifConditionsPass( condition ) {
    const { context } = this.props;
    const { user } = store.getState().vertx;

    const dataPool = {
      user,
      props: this.props,
      ...context,
    };

    /**
     * Loop through all of the keys in the condition query and see whether
     * any of them don't match
     */
    if ( !isObject( condition ) && !isArray( condition )) {
      console.error( condition );
    }

    const fields = Object.keys( condition );

    for ( let i = 0; i < fields.length; i++ ) {
      const field = fields[i];
      let contextedField = field;

      if ( field.includes( '{{' )) {
        contextedField = this.curlyBracketParse( field );
      }

      /**
       * Each key is actually a path to a field in the context, so use dlv to
       * get the actual value */
      const actualValue = dlv( dataPool, contextedField );

      if ( !actualValue ) {
        return false;
      }

      /**
       * Use the doesValueMatch function from the find data query operator to ensure
       * that the value, inside the context at the specified path, matches against
       * either:
       * - An explict value, like another string, or alternatively against a condition
       * - Or an object based on the MongoDB query syntax.
       */
      if ( !doesValueMatch( actualValue, condition[field], dataPool )) {
        return false;
      }
    }

    return true;
  }

  render() {
    const {
      component,
      props,
      variant,
      useThemeFrom,
      children,
      context,
      repeat,
      onlyShowIf,
      dontShowIf,
      conditional,
      theme,
    } = this.props;

    if ( !component || !Components[component] ) {
      return (
        <Text>
          Component '
          {component || 'undefined'}
          ' does not exist
        </Text>
      );
    }

    /* Check whether this component has onlyShowIf logic attached */
    if ( onlyShowIf ) {
      /* Render out nothing if we don't meet that logic */
      if ( !this.ifConditionsPass( onlyShowIf )) {
        return null;
      }
    }

    /* Check whether this component has dontShowIf logic attached */
    if ( dontShowIf ) {
      /* Render out nothing if we do meet that logic */
      if ( this.ifConditionsPass( dontShowIf )) {
        return null;
      }
    }

    const injectedRepeat = repeat ? dlv( context, repeat.substring( 1 )) : null;

    /**
     * TODO:
     *
     * Investigate performance optimisation
     */
    const repeatedChildren =
      injectedRepeat && injectedRepeat instanceof Array
        ? injectedRepeat.map( child => {
          return {
            ...children,
            props: {
              ...children.props,
              ...( Array.isArray( child ) ? child : {}),
            },
            context: {
              ...context,
              repeater: child,
              parentRepeater: context.repeater,
            },
          };
        })
        : this.injectContextIntoChildren( context, children );

    const componentProps = this.injectContextIntoProps({
      ...(
        variant &&
        theme.components[useThemeFrom || component] &&
        theme.components[useThemeFrom || component][variant]
      ),
      ...props,
      ...this.calculateConditionalProps( conditional, context ),
    });

    return createElement(
      Components[component],
      componentProps,
      isArray( repeatedChildren ) ? (
        repeatedChildren.map(( child, index ) => (
          <Recursive
            context={context}
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            theme={theme}
            {...child}
          />
        ))
      ) : isObject( repeatedChildren ) ? (
        <Recursive
          context={context}
          theme={theme}
          {...repeatedChildren}
        />
      ) : (
        repeatedChildren
      )
    );
  }
}

const mapStateToProps = state => ({
  theme: state.theme,
});

export default connect( mapStateToProps )( Recursive );
