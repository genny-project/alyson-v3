import { applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { routerMiddleware } from 'react-router-redux';
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

export default applyMiddleware(
  ...( process.env.NODE_ENV === 'production' )
    ? productionMiddleware
    : developmentMiddleware
);
