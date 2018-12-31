import { applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { routerMiddleware } from 'react-router-redux';
import { batchedSubscribe } from 'redux-batched-subscribe';
import queryString from 'query-string';
import logger from 'redux-logger';
import epics from './epics';
import vertxMiddleware from '../views/components/vertx/vertx.middleware';
import history from './history';

const epicMiddleware = createEpicMiddleware( epics );
const router = routerMiddleware( history );

const developmentMiddleware = [
  epicMiddleware,
  vertxMiddleware,
  router,
  logger,
];

const productionMiddleware = [
  epicMiddleware,
  vertxMiddleware,
  router,

];

/* Parse the URL parameters */
const query = queryString.parse( window.location.search );

if (( window.localStorage && window.localStorage.getItem( 'DISPLAY_LOGS' ) != null ) || query.debug ) { 
  productionMiddleware.push( logger );
}

/* Batches redux actions by frames to increase performance */
const debounceNotify = notify => {
  window.requestAnimationFrame( notify );
};

export default compose( applyMiddleware(
  ...( process.env.NODE_ENV === 'production' )
    ? productionMiddleware
    : developmentMiddleware
),
batchedSubscribe( debounceNotify )
);
