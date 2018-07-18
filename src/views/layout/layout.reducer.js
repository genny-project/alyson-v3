const initialState = {
  hideSidebar: false,
  showHeader: false,
  appName: '',
  headerProps: {},
};

const reducer = ( state = initialState, { type, payload }) => {
  switch ( type ) {
    case 'LAYOUT_SIDEBAR_VISIBILITY_SET':
      return {
        ...state,
        hideSidebar: payload,
      };

    case 'LAYOUT_HEADER_VISIBILITY_SET':
      return {
        ...state,
        showHeader: payload,
      };

    case 'LAYOUT_HEADER_PROPS_SET':
      return {
        ...state,
        headerProps: payload,
      };

    case 'APP_NAME_SET':
      return {
        ...state,
        appName: payload,
      };

    case 'BASE_ENTITY_MESSAGE': {
      if ( payload.aliasCode !== 'PROJECT' )
        return state;

      try {
        const { baseEntityAttributes } = payload.items.find( item => item.code === 'PRJ_CHANNEL40' );
        const { valueString } = baseEntityAttributes.find( attrib => attrib.attributeCode === 'PRI_NAME' );

        return {
          ...state,
          appName: valueString,
        };
      }
      catch ( error ) {
        return state;
      }
    }

    case 'USER_LOGOUT':
      return { ...initialState };

    default:
      return state;
  }
};

export default reducer;
