import { applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import logger from 'redux-logger';
import epics from './epics';

const epicMiddleware = createEpicMiddleware( epics );

const developmentMiddleware = [
  epicMiddleware,
  logger,
];

const productionMiddleware = [
  epicMiddleware,
];

export default applyMiddleware(
  ...( process.env.NODE_ENV === 'production' )
    ? productionMiddleware
    : developmentMiddleware
);
