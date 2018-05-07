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

const reducer = ( state = initialState, { type, payload }) => { // eslint-disable-line no-unused-vars
  switch ( type ) {
    /**
     * When we receive a base entity, we want to loop through the items in the payload and convert
     * the array of items into a hash map / object. The keys for this object are the `code` property
     * on the item (base entity), and the value is the base entity object (well, most of it). We store this data as the
     * `data` property in the reducer. The reason why we store 'most of' the base entity in `data` is because we
     * want to separate the actual base entity attributes into its own property, as stated below.
     *
     * The `attributes` property in the reducer refers to the actual attributes of the base entity.
     *
     * TODO: explain `links`
     */
    case 'BASE_ENTITY_MESSAGE':
      return {
        ...state,

        data: {
          ...state.data,
          ...payload.items.reduce(( resultant, current ) => {
            /* Shortcut to remove properties inside the `current` object. */
            const { baseEntityAttributes, ...wantedData } = current; // eslint-disable-line no-unused-vars

            wantedData.links = wantedData.links.map( link => link.link.linkValue );

            resultant[current.code] = wantedData;

            return resultant;
          }, {}),
        },

        attributes: {
          ...state.attributes,
          ...payload.items.reduce(( resultant, current ) => {
            if ( current.baseEntityAttributes ) {
              const baseEntityAttributes = current.baseEntityAttributes.reduce(( resultantAttributes, currentAttribute ) => {
                resultantAttributes[currentAttribute.attributeCode] = currentAttribute;

                return resultantAttributes;
              }, {});

              resultant[current.code] = baseEntityAttributes;
            }

            return resultant;
          }, {}),
        },

        links: {
          ...state.links,
          ...payload.items.reduce(( resultant, current ) => {
            current.links.forEach( link => {
              resultant[link.link.linkValue] = ({
                ...state.links[link.link.linkValue],
                [link.link.targetCode]: link,
              });
            });

            return resultant;
          }, {}),
        },
      };

    /**
     * When we receive attribute data, we are renaming it to `definitions` for semantic purposes. This does not
     * contain real data, but mainly validation rules for getting data / attributes.
     *
     * `definitions` is split into two categories, `data` and `types`. Types are a key/value pair, where the key
     * is the `typeName`, and the value is the type (including the validation rules). This is so that we are not
     * storing any duplicate data and bloating our reducer.
     *
     * The `data` property in `definitions` holds the actual definition and is stored by the `code` key. The `dataType`
     * property references the corresponding dataType in the `type` category.
     */
    case 'ATTRIBUTE_DATA':
      return {
        ...state,

        definitions: {
          ...state.definitions,

          data: {
            ...state.definitions.types,
            ...payload.items.reduce(( resultant, current ) => {
              resultant[current.code] = {
                ...current,
                dataType: current.dataType.typeName,
              };

              return resultant;
            }, {}),
          },

          types: {
            ...state.definitions.data,
            ...payload.items.reduce(( resultant, current ) => {
              const { dataType } = current;

              resultant[dataType.typeName] = dataType;

              return resultant;
            }, {}),
          },
        },
      };

    /**
     * TODO:
     * Insert the `question` property (need to go recursively) into `definitions`
     */
    case 'ASK_DATA':
      return state;

    default:
      return state;
  }
};

export default reducer;
