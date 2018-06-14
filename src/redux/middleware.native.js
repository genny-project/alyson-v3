import { applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import logger from 'redux-logger';
import epics from './epics';
import vertxMiddleware from '../views/components/vertx/vertx.middleware';
import navigationMiddleware from '../views/routing/navigation.middleware';

const epicMiddleware = createEpicMiddleware( epics );

const developmentMiddleware = [
  epicMiddleware,
  vertxMiddleware,
  navigationMiddleware,
  logger,
];

const productionMiddleware = [
  epicMiddleware,
  vertxMiddleware,
  navigationMiddleware,
];

export default applyMiddleware(
  ...( process.env.NODE_ENV === 'production' )
    ? productionMiddleware
    : developmentMiddleware
);
