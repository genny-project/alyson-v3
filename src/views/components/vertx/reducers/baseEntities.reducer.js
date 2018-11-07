import copy from 'fast-copy';
import { isArray } from '../../../../utils';

const initialState = {
  data: {},
  relationships: {},
  aliases: {},
  attributes: {},
  definitions: {
    data: {},
    types: {},
  },
  links: {},
};

const getDisplayValueField = ( item ) => {
  if ( item.value != null )
    return item.value;

  if ( item.valueDouble != null ) {
    let local = navigator.language;

    if ( local == null )
      local = 'en-AU';

    const value = new Intl.NumberFormat( local ).format( item.valueDouble );

    return value
      ? new Intl.NumberFormat( local ).format( item.valueDouble )
      : item.valueDouble;
  }

  if ( item.valueInteger != null )
    return item.valueInteger;

  if ( item.valueLong != null )
    return item.valueLong;

  if ( item.valueDateTime != null )
    return item.valueDateTime;

  if ( item.valueDate != null )
    return item.valueDate;

  if ( item.valueBoolean != null )
    return item.valueBoolean;

  if ( item.valueMoney != null ) {
    const formatter = new Intl.NumberFormat( 'en-AU', {
      style: 'currency',
      currency: item.valueMoney.currency,
      minimumFractionDigits: 2,
    });

    return formatter.format( Number( item.valueMoney.amount ));
  }

  if ( item.valueString != null ) {
    if (
      item.valueString.startsWith( '[' ) &&
      item.valueString.endsWith( ']' )
    ) {
      try {
        const object = JSON.parse( item.valueString );

        return object;
      }
      catch ( error ) {
        return item.valueString;
      }
    }

    return item.valueString;
  }

  return null;
};

const handleReduceAttributeCodes = ( resultantAttributes, currentAttribute ) => {
  const displayValue = getDisplayValueField( currentAttribute );

  if ( displayValue != null ) {
    currentAttribute['value'] = displayValue;
  }

  resultantAttributes[currentAttribute.attributeCode] = currentAttribute;

  return resultantAttributes;
};

const handleReduceAttributes = ( resultant, current ) => {
  if ( !current )
    return resultant;

  if ( current.baseEntityAttributes ) {
    const existing = resultant[current.code] || {};

    const baseEntityAttributes = current
      .baseEntityAttributes
      .reduce( handleReduceAttributeCodes, existing );

    resultant[current.code] = baseEntityAttributes;
  }

  return resultant;
};

const handleReplaceLinks = ( resultant, current ) => {
  return handleReduceLinks( resultant, current, true );
};

const handleReduceLinks = ( resultant, current, shouldReplace ) => {
  if ( !isArray( current.links ))
    return resultant;

  const removeMatchingExistingKeys = link => {
    if (
      link.link.linkValue &&
      resultant[current.code]
    ) {
      delete resultant[current.code];
    }
  };

  const handleCombineLinkValues = link => {
    if ( link.link.linkValue ) {
      resultant[current.code] = {
        ...resultant[current.code],
        [link.link.linkValue]: [
          ...( resultant[current.code] && isArray( resultant[current.code][link.link.linkValue] ))
            ? resultant[current.code][link.link.linkValue]
            : [],
          link,
        ],
      };
    }
  };

  console.log( resultant );

  if ( shouldReplace === true ) {
    current.links.forEach( removeMatchingExistingKeys );
    console.log( resultant );
  }

  current.links.forEach( handleCombineLinkValues );
  /*
  if ( current.parentCode ) {
    if ( !resultant[current.parentCode] ) {
      resultant[current.parentCode] = {
        links: [current.code],
      };
    }
    else {
      /* Group all the parent codes inside a links array. *//*
      resultant[current.parentCode] = {
        ...resultant[current.parentCode],
        links: [
          ...resultant[current.parentCode].links.filter( code => code !== current.code ),
          current.code,
        ],
      };
    }
  }
   */
  console.log( resultant );

  return resultant;
};

const handleReduceDefinitionData = ( resultant, current ) => {
  resultant[current.code] = {
    ...current,
    dataType: current.dataType.typeName,
  };

  return resultant;
};

const deleteLinkedBaseEntities = ( data, resultant, depth = 1 ) => {
  if ( !data ) return;

  const { shouldDeleteLinkedBaseEntities, code } = data;
  const links = resultant[code] ? resultant[code].links : data.links;

  links.forEach(({ link }) => {
    if ( depth >= shouldDeleteLinkedBaseEntities ) {
      delete resultant[link.targetCode];
    }
    else {
      deleteLinkedBaseEntities({
        ...resultant[link.targetCode],
        shouldDeleteLinkedBaseEntities,
      }, resultant, depth + 1 );
    }
  });
};

const createLink = ( current ) => ({
  created: current.created,
  updated: current.updated,
  code: current.code,
  weight: Number.isInteger( current.weight ) ? current.weight : 1,
  link: {
    attributeCode: 'LNK_CORE',
    targetCode: current.code,
    sourceCode: current.parentCode,
    weight: 1,
    linkValue: 'LINK',
    ...current.link,
  },
});

const handleReduceData = ( resultant, current ) => {
  if ( !current )
    return resultant;

  /* Shortcut to remove properties inside the current base entity. */
  const { baseEntityAttributes, ...wantedData } = current; // eslint-disable-line no-unused-vars

  if ( current.shouldDeleteLinkedBaseEntities ) {
    if ( Number.isInteger( current.shouldDeleteLinkedBaseEntities )) {
      deleteLinkedBaseEntities( current, resultant );
    }
  }

  resultant[current.code] = wantedData;
  /* If the current has a parentCode, ensure there is an accompanying base entity. */
  if ( current.parentCode ) {
    /* If the parent base entity does not exist, simply create a basic one with a link
     * back to the current base entity. */
    if ( !resultant[current.parentCode] ) {
      resultant[current.parentCode] = {
        links: [
          createLink( current ),
        ],
      };
    }
    /* If there already is a base entity, add the current base entity to the list of links
     * inside of it. Be sure that no duplicates occur by filtering out the current's code
     * from the list of existing links. */
    else {
      const noLinksExist = !isArray( resultant[current.parentCode].links, { ofMinLength: 1 });

      /* If no links exist yet, simply set the links to be array of the new link (current). */
      const newLinks = noLinksExist ? [
        createLink( current ),
      ] : (
        /* Loop through each existing link. */
        resultant[current.parentCode].links.reduce(( links, link, index ) => {
          /* If the current link is in the existing links, update the
           * existing link with the new link data (current). */
          if ( link.link.targetCode === current.code ) {
            links[index] = {
              ...link,
              updated: current.updated,
              link: {
                ...link.link,
                targetCode: current.code,
                sourceCode: current.parentCode,
                ...current.link,
              },
            };
          }
          /* If the new link (current) isn't already in the existing links, add it. */
          else if ( !links.find( link => link.link.targetCode === current.code )) {
            links.push(
              createLink( current )
            );
          }

          return links;
        }, resultant[current.parentCode].links )
      );

      resultant[current.parentCode] = {
        ...resultant[current.parentCode],
        links: newLinks,
      };
    }
  }

  return resultant;
};

const handleReduceDefinitionTypes = ( resultant, current ) => {
  const { dataType } = current;

  resultant[dataType.typeName] = dataType;

  return resultant;
};

const handleReduceAskQuestionData = ( resultant, current ) => {
  /* Shortcut to remove properties inside the `current` object. */
  const { dataType, ...wantedData } = current.question.attribute; // eslint-disable-line

  resultant[current.question.attributeCode] = wantedData;

  if ( isArray( wantedData.childAsks, { ofMinLength: 1 })) {
    return wantedData.childAsks.reduce( handleReduceAskQuestionData, resultant );
  }

  return resultant;
};

const handleReduceAskQuestionTypes = ( resultant, current ) => {
  const { dataType, childAsks } = current.question.attribute;

  resultant[dataType.typeName] = dataType;

  if ( isArray( childAsks, { ofMinLength: 1 })) {
    return childAsks.reduce( handleReduceAskQuestionTypes, resultant );
  }

  return resultant;
};

const handleRemoveLayoutAttributes = attributes => {
  return Object
    .keys( attributes )
    .filter( key => !key.startsWith( 'LAY_' ))
    .reduce(( result, current ) => ({
      ...result,
      [current]: attributes[current],
    }), {});
};

const handleUpdateProjectName = ( attributes, name ) => {
  /* Find the project key */
  const key = Object.keys( attributes ).find( key => key.startsWith( 'PRJ_' ));

  return {
    [key]: {
      ...attributes[key],
      PRI_NAME: {
        ...attributes[key].PRI_NAME,
        value: name,
        valueString: name,
      },
    },
  };
};

function handleReduceDataTwo( message, state ) {
  const newState = copy( state );

  delete newState[message.parentCode];

  if (
    message.delete &&
    !message.shouldDeleteLinkedBaseEntities
  ) {
    return newState;
  }

  return message.items.reduce( handleReduceData, newState );
}

// function handleReduceLinksTwo( message, state ) {
//   const newState = copy( state );

//   if ( message.parentCode ) {
//     delete newState[message.parentCode];
//   }
//   else if ( isArray( message.items )) {
//     message.items.forEach( item => {
//       delete newState[item.code];
//     });
//   }

//   if (
//     message.delete &&
//     !message.shouldDeleteLinkedBaseEntities
//   ) {
//     return newState;
//   }

//   return message.items.reduce( handleReduceLinks, newState );
// }

const reducer = ( state = initialState, { type, payload }) => {
  switch ( type ) {
    /**
     * When we receive a base entity, we want to loop through the items in the payload and convert
     * the array of items into a hash map / object. The keys for this object are the `code` property
     * on the item (base entity), and the value is the base entity object (well, most of it).
     * We store this data as the `data` property in the reducer. The reason why we store 'most of'
     * the base entity in `data` is because we want to separate the actual base entity attributes
     * into its own property, as stated below.
     *
     * The `attributes` property in the reducer refers to the actual attributes of the base entity.
     *
     * TODO: explain `links`
     */
    case 'BASE_ENTITY_MESSAGE': {
      if (
        payload.replace ||
        payload.delete
      ) {
        console.log( payload.replace );

        return {
          ...state,
          data: handleReduceDataTwo( payload, state.data ),
          attributes: payload.items.reduce( handleReduceAttributes, state.attributes ),
          links: payload.items.reduce( handleReplaceLinks, state.links ),
          // links: handleReduceLinksTwo( payload, state.links ),
        };
      }

      return {
        ...state,
        data: payload.items.reduce( handleReduceData, state.data ),
        attributes: payload.items.reduce( handleReduceAttributes, state.attributes ),
        links: payload.items.reduce( handleReduceLinks, state.links ),
      };
    }

    /**
     * When we receive attribute data, we are renaming it to `definitions` for semantic purposes.
     * This does not contain real data, but mainly validation rules for getting data / attributes.
     *
     * `definitions` is split into two categories, `data` and `types`. Types are a key/value pair,
     * where the key is the `typeName`, and the value is the type (including the validation rules).
     * This is so that we are not storing any duplicate data and bloating our reducer.
     *
     * The `data` property in `definitions` holds the actual definition and is stored by the `code`
     * key. The `dataType` property references the corresponding dataType in the `type` category.
     */
    case 'ATTRIBUTE_DATA':
      return {
        ...state,

        definitions: {
          ...state.definitions,
          data: payload.items.reduce( handleReduceDefinitionData, state.definitions.data ),
          types: payload.items.reduce( handleReduceDefinitionTypes, state.definitions.types ),
        },
      };

    /**
     * If we receive ask data, ensure all of the data and types that are used
     * inside of the ask are stored inside this reducer.
     */
    case 'ASK_DATA':
      return {
        ...state,

        definitions: {
          ...state.definitions,
          data: payload.items.reduce( handleReduceAskQuestionData, state.definitions.data ),
          types: payload.items.reduce( handleReduceAskQuestionTypes, state.definitions.types ),
        },
      };

    /**
     * If we receive a CLEAR_ALL_LAYOUTS we need to remove any attributes that start with LAY_
     * We do this so that we can load in all of our development layouts.
     */
    case 'CLEAR_ALL_LAYOUTS':
      return {
        ...state,
        attributes: handleRemoveLayoutAttributes( state.attributes ),
      };

    /**
     * Loads in an individual dev layout as an attribute
     */
    case 'LOAD_DEV_LAYOUT':
      return {
        ...state,
        attributes: {
          ...state.attributes,
          ...payload,
        },
      };

    /**
     * Updates the project name in the reducer. Used for development
     */
    case 'UPDATE_PROJECT_NAME':
      return {
        ...state,
        attributes: {
          ...state.attributes,
          ...handleUpdateProjectName( state.attributes, payload ),
        },
      };

    case 'USER_LOGOUT':
      return { ...initialState };

    default:
      return state;
  }
};

export default reducer;
