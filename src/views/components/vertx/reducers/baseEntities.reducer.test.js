import reducer, {
  getDisplayValueField,
} from './baseEntities.reducer';
import mockMessages from './mockMessages.json';
import * as events from '../../../../utils/vertx/events';

const initialState = reducer( undefined, {});

const eventTypes = {
  DATA_MSG: 'data_type',
  CMD_MSG: 'cmd_type',
  EVT_MSG: 'event_type',
};

let state = initialState;

/* Find the correct actions for each message and run them through the reducer
 * to update the state. */
function mockMessage( message ) {
  const eventType = eventTypes[message.msg_type];
  const event = message[eventType];
  const action = events[event]( message );

  state = reducer( state, action );
}

mockMessages.forEach( message => {
  const { data_type, messages } = message;

  if ( data_type === 'QBulkMessage' )
    messages.forEach( mockMessage );
  else
    mockMessage( message );
});

describe( 'baseEntities reducer', () => {
  describe( 'initial state', () => {
    it( 'should match snapshot', () => {
      expect( initialState ).toMatchSnapshot();
    });
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

      /* Ensure both the first item in the list and the last item contain the
       * expected keys above. Perhaps in the future we can either test all of
       * the items or just also test the midway item once we get more mock
       * messages. */
      expectedKeys.forEach( key => {
        expect( firstApplication ).toHaveProperty( key );
        expect( lastApplication ).toHaveProperty( key );
      });
    });
  });

  describe( 'getDisplayValueField', () => {
    it( 'should return correct value from item.value', () => {
      const actual1 = getDisplayValueField({ value: 'hello' });
      const actual2 = getDisplayValueField({ value: 2 });
      const actual3 = getDisplayValueField({ value: true });

      expect( actual1 ).toEqual( 'hello' );
      expect( actual2 ).toEqual( 2 );
      expect( actual3 ).toEqual( true );
    });

    it( 'should return double value from item.valueDouble', () => {
      /* Set the locale for this test. Some languages return commas instead of
       * dots so we have to ensure this test is consistent across computers. */
      Object.defineProperty( navigator, 'language', { get: () => 'en-AU' });

      const actual1 = getDisplayValueField({ valueDouble: '2.3' });

      expect( actual1 ).toEqual( '2.3' );
    });

    it( 'should return correct value from item.valueInteger', () => {
      const actual = getDisplayValueField({ valueInteger: 2 });

      expect( actual ).toEqual( 2 );
    });

    it( 'should return correct value from item.valueLong', () => {
      const actual = getDisplayValueField({ valueLong: 2 });

      expect( actual ).toEqual( 2 );
    });

    it( 'should return correct value from item.valueDateTime', () => {
      const actual = getDisplayValueField({ valueDateTime: '2018-12-14T00:13:18.752Z' });

      expect( actual ).toEqual( '2018-12-14T00:13:18.752Z' );
    });

    it( 'should return correct value from item.valueDate', () => {
      const actual = getDisplayValueField({ valueDate: '2018-12-14' });

      expect( actual ).toEqual( '2018-12-14' );
    });

    it( 'should return correct value from item.valueBoolean', () => {
      const actual = getDisplayValueField({ valueBoolean: true });

      expect( actual ).toEqual( true );
    });

    it( 'should return correct value from item.valueMoney', () => {
      const actual = getDisplayValueField({ valueMoney: { amount: 2.5, currency: 'AUD' } });

      expect( actual ).toEqual( 'A$2.50' );
    });

    it( 'should return correct JSON object value from item.valueString', () => {
      const actual = getDisplayValueField({ valueString: '{"foo":"bar"}' });

      expect( actual ).toEqual({ foo: 'bar' });
    });

    it( 'should return correct JSON array value from item.valueString', () => {
      const actual = getDisplayValueField({ valueString: '[1,2]' });

      expect( actual ).toEqual( [1,2] );
    });

    it( 'should return correct value from item.valueString', () => {
      const actual = getDisplayValueField({ valueString: 'foo' });

      expect( actual ).toEqual( 'foo' );
    });
  });

  describe( 'deleteLinkedBaseEntities', () => {
    it( 'should delete the linked base entities', () => {

    });
  });
});
