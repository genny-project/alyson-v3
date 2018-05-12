import DataQuery from './DataQuery';
import store from '../../redux/store';

const query = [
  {
    operator: 'getBE',
    id: 'GRP_DASHBOARD',
    as: 'dashboard',
  },
  {
    operator: 'scope',
    path: 'dashboard.links',
    scope: {
      operator: 'getBE',
      basePath: 'baseEntities.data',
      as: 'be',
      id: '{{link.targetCode}}',
    },
  },
  {
    operator: 'map',
    fields: 'dashboard.links',
  },
  {
    operator: 'sort',
    by: 'weight',
    direction: 'asc',
  },
  {
    operator: 'map',
    fields: 'be',
  },
  {
    operator: 'scope',
    path: 'links',
    scope: {
      operator: 'getBE',
      basePath: 'baseEntities.data',
      as: 'be',
      id: '{{link.targetCode}}',
    },
  },
  {
    operator: 'map',
    fields: {
      name: 'name',
      items: 'links',
    },
  },
  {
    operator: 'scope',
    path: 'items',
    scope: {
      operator: 'find',
      query: {
        be: { $exists: true },
      },
    },
  },
  {
    operator: 'scope',
    path: 'items',
    scope: {
      operator: 'map',
      fields: {
        linkValue: 'link.linkValue',
        item: 'be',
      },
    },
  },
  {
    operator: 'scope',
    path: 'items',
    scope: {
      operator: 'populateLinkValues',
      field: 'item',
      as: 'links',
    },
  },
  {
    operator: 'scope',
    path: 'items',
    scope: {
      operator: 'populateAttributes',
      path: 'links',
    },
  },
  {
    operator: 'scope',
    path: 'items',
    scope: {
      operator: 'populateAttributes',
      path: 'item',
      single: true,
    },
  },
  // {
  //   operator: 'populateAttributes',
  //   path: 'item',
  // },
  // {
  //   operator: 'scope',
  //   path: 'items',
  //   scope: {
  //     operator: 'map',
  //     append: true,
  //     fields: {
  //
  //     },
  //   },
  // }
];

window.testQuery = () => {
  const dataQuery = new DataQuery( store.getState().vertx );
  const result = dataQuery.query( query );

  return result;
};
