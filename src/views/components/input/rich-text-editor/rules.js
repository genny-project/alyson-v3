import React from 'react';
// This file consists of rules for serializing and de serializing the values from Rich text editor 

const BLOCK_TAGS = {
  blockquote: 'quote',
  p: 'paragraph',
  pre: 'code',
};

// Add a dictionary of mark tags.
const MARK_TAGS = {
  em: 'italic',
  strong: 'bold',
  u: 'underline',
};

const rules = [
  {
    deserialize( el, next ) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()];

      if ( type ) {
        return {
          object: 'block',
          type: type,
          data: {
            className: el.getAttribute( 'class' ),
          },
          nodes: next( el.childNodes ),
        };
      }
    },
    serialize( obj, children ) {
      if ( obj.object === 'block' ) {
        switch ( obj.type ) {
          case 'code':
            return (
              <pre>
                <code>
                  {children}
                </code>
              </pre>
            );
          case 'paragraph':
            return (
              <p className={obj.data.get( 'className' )}>
                {children}
              </p>
            );
          case 'quote':
            return (
              <blockquote>
                {children}
              </blockquote>
            );
        }
      }
    },
  },
  // Add a new rule that handles marks...
  {
    deserialize( el, next ) {
      const type = MARK_TAGS[el.tagName.toLowerCase()];

      if ( type ) {
        return {
          object: 'mark',
          type: type,
          nodes: next( el.childNodes ),
        };
      }
    },
    serialize( obj, children ) {
      if ( obj.object === 'mark' ) {
        switch ( obj.type ) {
          case 'bold':
            return (
              <strong>
                {children}
              </strong>
            );
          case 'italic':
            return (
              <em>
                {children}
              </em>
            );
          case 'underline':
            return (
              <u>
                {children}
              </u>
            );
        }
      }
    },
  },
];

export default rules;
