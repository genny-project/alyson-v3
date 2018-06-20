import React, { createElement, Component } from 'react';
import { Text } from 'react-native';
import dlv from 'dlv';
import copy from 'fast-copy';
import { object, any, string } from 'prop-types';
import { doesValueMatch } from '../../../utils/data-query/operators/find';
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
    conditional: object,
  }

  handleMapCurlyTemplate = template => {
    if (
      !template ||
      !template.includes( '}}' )
    ) {
      return template;
    }

    const { context } = this.props;

    const splitTemplate = template.split( '}}' );
    const path = splitTemplate[0];

    const textAfterTemplate = splitTemplate.slice( 1 );
    const resolved = dlv( context, path );

    return `${resolved}${textAfterTemplate}`;
  }

  curlyBracketParse = string => {
    return (
      String( string )
        .split( '{{' )
        .map( this.handleMapCurlyTemplate )
        .join( '' )
    );
  }

  calculateConditionalProps = ( conditionalProps, context ) => {
    /* If no conditional props or no context is provided return an empty object */
    if ( !conditionalProps || !context ) {
      return {};
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
    if ( this.shouldRenderComponent( ifCondition, context )) {
      return thenProps;
    }

    return elseProps;
  };

  handleReducePropInjection = ( result, current ) => {
    const { context } = this.props;

    if ( result[current] == null )
      return result;

    if ( typeof result[current] === 'string' ) {
      if ( result[current].startsWith( '_' )) {
        result[current] = dlv( context, result[current].substring( 1 ));

        return result;
      }

      if ( result[current].includes( '{{' )) {
        result[current] = this.curlyBracketParse( result[current] );

        return result;
      }

      return result;
    }

    /* TODO: Make this call the current function recursively.
     * Issue is that `context` suddenly becomes undefined. Look into. */
    if ( result[current] instanceof Array ) {
      for ( let i = 0; i < result[current].length; i++ ) {
        const element = result[current][i];

        if ( typeof element === 'string' ) {
          if ( element.startsWith( '_' )) {
            result[current][i] = dlv( context, element.substring( 1 ));
          }

          if ( element.includes( '{{' )) {
            result[current][i] = this.curlyBracketParse( element );
          }
        }
      }

      result[current] = result[current].reduce(
        this.handleReducePropInjection, result[current]
      );

      return result;
    }

    if ( typeof result[current] === 'object' ) {
      const keys = Object.keys( result[current] );

      result[current] = keys.reduce( this.handleReducePropInjection, result[current] );

      return result;
    }

    return result;
  }

  injectContextIntoChildren( context, children ) {
    return (
      typeof children === 'string' &&
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
    if ( !props )
      return {};

    const propsCopy = copy( props );

    const afterProps =
      Object
        .keys( props )
        .reduce( this.handleReducePropInjection, propsCopy );

    return afterProps;
  }

  /* Determines whether or not we should render a component, used for onlyShowIf functionality */
  shouldRenderComponent() {
    const { dontShowIf, onlyShowIf, context } = this.props;

    const vertxStore = store.getState().vertx;
    const userAlias = vertxStore.aliases.USER;
    const userData = dlv( vertxStore, `baseEntities.attributes.${userAlias}` );

    const dataPool = {
      user: userData,
      ...context,
    };

    if ( onlyShowIf ) {
      /**
       * Loop through all of the keys in the onlyShowIf query and see whether
       * any of them don't match
       */
      const onlyShowIfFields = Object.keys( onlyShowIf );

      for ( let i = 0; i < onlyShowIfFields.length; i++ ) {
        const field = onlyShowIfFields[i];

        /**
         * Each key is actually a path to a field in the context, so use dlv to
         * get the actual value */
        const actualValue = dlv( dataPool, field );

        /**
         * Use the doesValueMatch function from the find data query operator to ensure
         * that the value, inside the context at the specified path, matches against
         * either:
         * - An explict value, like another string, or alternatively against a condition
         * - Or an object based on the MongoDB query syntax.
         */
        if ( !doesValueMatch( actualValue, onlyShowIf[field], dataPool )) {
          return false;
        }
      }
    }

    if ( dontShowIf ) {
      /* See above for docs, but invert the points. */
      const dontShowIfFields = Object.keys( dontShowIf );

      for ( let i = 0; i < dontShowIfFields.length; i++ ) {
        const field = dontShowIfFields[i];
        const actualValue = dlv( dataPool, field );

        if ( doesValueMatch( actualValue, dontShowIf[field], dataPool )) {
          return false;
        }
      }
    }

    return true;
  }

  render() {
    const {
      component,
      props,
      children,
      context,
      repeat,
      onlyShowIf,
      dontShowIf,
      conditional,
    } = this.props;

    if ( !component )
      return children;

    if ( !Components[component] ) {
      return (
        <Text>
          Component '
          {component}
          ' does not exist
        </Text>
      );
    }

    /* Check whether this component has onlyShowIf logic attached */
    if ( onlyShowIf || dontShowIf ) {
      /* Render out nothing if we don't meet that logic */
      if ( !this.shouldRenderComponent()) {
        return null;
      }
    }

    const injectedRepeat = repeat ? dlv( context, repeat.substring( 1 )) : null;

    const repeatedChildren = (
      injectedRepeat &&
      injectedRepeat instanceof Array
    )
      ? injectedRepeat.map( child => ({
        ...children,
        props: {
          ...children.props, ...child,
        },
        context: {
          ...context,
          repeater: child,
          parentRepeater: context.repeater,
        },
      }))
      : this.injectContextIntoChildren( context, children );

    const componentProps = this.injectContextIntoProps({
      ...props,
      ...this.calculateConditionalProps( conditional, context ),
    });

    return createElement(
      Components[component],
      componentProps,
      repeatedChildren instanceof Array
        ? repeatedChildren.map(( child, index ) => (
          <Recursive
            context={context}
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            {...child}
          />
        ))
        : typeof repeatedChildren === 'object'
          ? (
            <Recursive
              context={context}
              {...repeatedChildren}
            />
          )
          : repeatedChildren
    );
  }
}

export default Recursive;
