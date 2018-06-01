const reduceChildAsks = childAsks => {
  if (
    !childAsks ||
    !( childAsks instanceof Array ) ||
    childAsks.length === 0
  ) {
    return [];
  }

  return childAsks.map( childAsk => ({
    ...childAsk,
    childAsks: reduceChildAsks( childAsk.childAsks ),
  }));
};

const reducer = ( state = {}, { type, payload }) => {
  switch ( type ) {
    case 'ASK_DATA':
      return {
        ...state,
        ...payload.items.reduce(( resultant, current ) => {
          resultant[current.questionCode] = {
            ...current,
            childAsks: reduceChildAsks( current.childAsks ),
          };

          return resultant;
        }, {}),
      };

    default:
      return state;
  }
};

export default reducer;
