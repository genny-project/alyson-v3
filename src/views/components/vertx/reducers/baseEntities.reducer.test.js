import reducer from './baseEntities.reducer';
import mockMessage from './mockMessage.json';
import * as events from '../../../../utils/vertx/events';

const initialState = reducer( undefined, {});

const eventTypes = {
  DATA_MSG: 'data_type',
  CMD_MSG: 'cmd_type',
  EVT_MSG: 'event_type',
};

describe( 'baseEntities reducer', () => {
  describe( 'initial state', () => {
    it( 'should match snapshot', () => {
      expect( initialState ).toMatchSnapshot();
    });
  });

  let state = initialState;

  mockMessage.messages.forEach( message => {
    const { msg_type } = message;
    const eventType = eventTypes[msg_type];
    const event = message[eventType];
    const action = events[event]( message );

    state = reducer( state, action );
  });

  describe( 'base entity message', () => {
    const keys = Object.keys( state.data );

    it( 'should add data to the reducer', () => {
      expect( state ).toHaveProperty( 'data' );
      expect( keys.length ).toBeGreaterThan( 0 );
    });

    const firstApplication = state.data[keys[0]];
    const lastApplication = state.data[keys[keys.length - 1]];

    it( 'should store data in the correct format', () => {
      const expectedKeys = [
        'code',
        'created',
        'id',
        'index',
        'links',
        'name',
        'realm',
      ];

      expectedKeys.forEach( key => {
        expect( firstApplication ).toHaveProperty( key );
        expect( lastApplication ).toHaveProperty( key );
      });
    });
  });
});
