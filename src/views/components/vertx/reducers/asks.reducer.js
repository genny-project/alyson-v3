const reduceChildAsks = childAsks => {
  if (
    !childAsks ||
    !( childAsks instanceof Array ) ||
    childAsks.length === 0
  ) {
    return [];
  }

  return childAsks.map( childAsk => {
    /* Shortcut to remove properties inside the `childAsk` object. */
    const { question, ...wantedData } = childAsk; // eslint-disable-line no-unused-vars

    return {
      ...wantedData,
      childAsks: reduceChildAsks( childAsk.childAsks ),
    };
  });
};

const reducer = ( state = {}, { type, payload }) => {
  switch ( type ) {
    case 'ASK_DATA':
      return {
        ...state,
        ...payload.items.reduce(( resultant, current ) => {
          /* Shortcut to remove properties inside the `current` object. */
          const { question, ...wantedData } = current; // eslint-disable-line no-unused-vars

          resultant[current.questionCode] = {
            ...wantedData,
            childAsks: reduceChildAsks( wantedData.childAsks ),
          };

          return resultant;
        }, {}),
      };

    default:
      return state;
  }
};

export default reducer;
