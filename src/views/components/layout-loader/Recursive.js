import React, { createElement, cloneElement, Component, isValidElement } from 'react';
import { Text } from 'react-native';
import dlv from 'dlv';
import copy from 'fast-copy';
import { connect } from 'react-redux';
import { object, any, string, array, oneOfType, shape, arrayOf } from 'prop-types';
import { isObject, isArray, isString, ifConditionsPass } from '../../../utils';
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
    sort: shape({
      by: string,
    }),
    dontInjectContextIntoProps: arrayOf( string ),
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

  handleSortRepeatedChildren = ( a, b ) => {
    const { sort } = this.props;

    if ( typeof sort === 'string' ) {
      switch ( sort ) {
        case 'reverse': return 1; // Place the current element after the next one (i.e. reverse order)
        default: return 0;
      }
    }

    if ( !isObject( sort ))
      return 0;

    const aContext = a && a.context;
    const bContext = b && b.context;

    const {
      order = 'ascending',
      by,
      isDate,
    } = sort;

    if ( by ) {
      let first;
      let second;

      if ( isDate ) {
        first = new Date( dlv( aContext, sort.by )).valueOf();
        second = new Date( dlv( bContext, sort.by )).valueOf();
      }
      else {
        first = dlv( aContext, sort.by );
        second = dlv( bContext, sort.by );
      }

      switch ( order ) {
        case 'descending': return first - second;
        default: return second - first;
      }
    }

    return 0;
  }

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

    if ( !elseProps ) {
      return {};
    }

    if ( elseProps.if ) {
      return this.calculateConditionalProps( elseProps, context );
    }

    return elseProps;
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

      if ( result[current] && result[current].renderAsComponent ) {
        result[current] = <Recursive {...result[current]} />;

        return result;
      }

      if ( result[current] ) {
        result[current] = keys.reduce( this.handleReducePropInjection, result[current] );
      } else {
        result[index] = keys.reduce( this.handleReducePropInjection, result[index] );
      }
      // console.warn( 'Result', result );

      return result;
    }

    return result;
  };

  injectContextIntoChildren( context, children ) {
    if ( isString( children )) {
      if ( children.startsWith( '_' )) {
        let temp = children;

        if ( children.includes( '{{' )) {
          temp = this.curlyBracketParse( children );
        }

        return dlv( context, temp.substring( 1 ));
      }

      if ( children.includes( '{{' )) {
        return this.curlyBracketParse( children );
      }
    }

    return children;
  }

  /**
   * Loops through all of the props for this element and inject the context if required.
   * Additionally parse a handlebars style string and inject variables from the context if needed.
   * If the prop is not a string, simply return its current value so that functions work
   * correctly.
   */
  injectContextIntoProps( props ) {
    if ( !isObject( props )) return {};

    const { dontInjectContextIntoProps } = this.props;
    const propsCopy = copy( props );
    let afterProps;

    try {
      afterProps = Object.keys( propsCopy ).reduce( this.handleReducePropInjection, propsCopy );
    } catch ( e ) {
      console.error( 'FOUND IT' );
    }

    if ( isArray( dontInjectContextIntoProps )) {
      dontInjectContextIntoProps.forEach( key => {
        /* Revert the keys. */
        afterProps[key] = props[key];
      });
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

    return ifConditionsPass( condition, dataPool );
  }

  render() {
    const {
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

    let componentProps = this.injectContextIntoProps({
      ...props,
      ...this.calculateConditionalProps( conditional, context ),
    });

    const component = componentProps.component || this.props.component;

    if ( variant ) {
      componentProps = {
        ...this.injectContextIntoProps({
          ...(
            theme.components[useThemeFrom || component] &&
            theme.components[useThemeFrom || component][variant] &&
            theme.components[useThemeFrom || component][variant].props
          ),
        }),
        ...componentProps,
      };
    }

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
    const repeatedChildren = isArray( injectedRepeat ) ? (
      injectedRepeat.map(( child, index ) => ({
        ...children,
        props: {
          ...children.props,
          ...isArray( child ) ? child : {},
        },
        context: {
          ...context,
          repeater: !isObject( child ) ? child : {
            ...child,
            $index: index,
          },
          parentRepeater: context.repeater,
        },
      }))
    ) : (
      this.injectContextIntoChildren( context, children )
    );

    return createElement(
      Components[component],
      componentProps,
      isArray( repeatedChildren ) ? (
        repeatedChildren
          .sort( this.handleSortRepeatedChildren )
          .map(( child, index ) => (
            isValidElement( child )
              ? cloneElement( child, { key: index, context, theme })
              : (
                <Recursive
                  context={context}
                // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  theme={theme}
                  {...child}
                />
              )
          ))
      ) : isObject( repeatedChildren ) ? (
        isValidElement( repeatedChildren )
          ? cloneElement( repeatedChildren, { context, theme })
          : (
            <Recursive
              context={context}
              theme={theme}
              {...repeatedChildren}
            />
          )
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
