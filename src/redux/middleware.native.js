import { applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import logger from 'redux-logger';
import epics from './epics';
import vertxMiddleware from '../views/components/vertx/vertx.middleware';

const epicMiddleware = createEpicMiddleware( epics );

const developmentMiddleware = [
  epicMiddleware,
  vertxMiddleware,
  logger,
];

const productionMiddleware = [
  epicMiddleware,
  vertxMiddleware,
];

export default applyMiddleware(
  ...( process.env.NODE_ENV === 'production' )
    ? productionMiddleware
    : developmentMiddleware
);
