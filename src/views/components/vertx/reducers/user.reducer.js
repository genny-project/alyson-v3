import { isArray } from '../../../../utils';

const initialState = {
  data: {},
  attributes: {},
  capabilities: {},
  roles: [],
};

const handleReduceAttributes = ( resultant, attribute ) => {
  const { attributeCode } = attribute;

  resultant[attributeCode] = attribute;

  return resultant;
};

const handleReduceRoles = ( roles, { valueString, link }) => {
  if ( valueString === 'ROLE' ) {
    roles.push( link.targetCode );
  }

  return roles;
};

const reducer = ( state = initialState, { type, payload }) => {
  switch ( type ) {
    case 'BASE_ENTITY_MESSAGE': {
      if ( !isArray( payload.items, { ofMinLength: 1 }))
        return state;

      /* If we're sent through the user base entities, populate the
       * data, attributes and roles for the user. */
      if ( payload.aliasCode === 'USER' ) {
        const {
          baseEntityAttributes,
          links,
          ...restData
        } = payload.items[0];

        return {
          ...state,
          data: restData,
          attributes: baseEntityAttributes.reduce( handleReduceAttributes, state.attributes ),
          roles: links.reduce( handleReduceRoles, state.roles ),
        };
      }

      /* If we've already got the user roles in the reducer, check if the
       * message that has been sent through contains any of the roles set
       * on the user. */
      if ( state.roles.length > 0 ) {
        /* Keep track of whether we have found any new capabilities for the user. */
        let didFindCapabilities = false;

        /* Loop through all of the items sent through in the base entity message. */
        const capabilities = payload.items.reduce(( resultant, item ) => {
          /* If we find a match between our roles and the item sent through,
           * loop through the baseEntityAttributes inside the item to find the
           * `LNK_SELECT_CAPABILITY` attribute. This attribute contains an array
           * of all of the capabilities we are looking for. Go through this array
           * and add it into our object full of user capabilities. */
          if ( state.roles.includes( item.code )) {
            const capabilitiesAttribute = item.baseEntityAttributes.find(
              attribute => attribute.attributeCode === 'LNK_SELECT_CAPABILITY'
            );

            if ( capabilitiesAttribute ) {
              /* If we get to this stage, we know for sure we've found a valid
               * set of capabilities for the user's role. */
              didFindCapabilities = true;

              /* Loop through the capabilities and save them to the reducer. */
              capabilitiesAttribute.value.forEach( attribute => {
                resultant[attribute] = true;
              });
            }
          }

          return resultant;
        }, {});

        /* Make sure to update the state when we have found new capabilities. */
        if ( didFindCapabilities )
          return { ...state, capabilities };
      }

      return state;
    }

    case 'USER_LOGOUT':
      return { ...initialState };

    default:
      return state;
  }
};

export default reducer;
