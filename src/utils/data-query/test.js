import DataQuery from './DataQuery';

const data = [
  {
    name: 'Matt',
    team: 'Pleased Property',
  },
  {
    name: 'Callan',
    team: 'Pleased Property',
  },
  {
    name: 'Loris',
    team: 'Genny',
  },
];

const query = [
  {
    operator: 'find',
    query: {
      team: 'Pleased Property',
    },
    projection: {
      name: true,
    },
  },
];

window.testQuery = () => {
  const dataQuery = new DataQuery( data );
  const result = dataQuery.query( query );
  return result;
};
