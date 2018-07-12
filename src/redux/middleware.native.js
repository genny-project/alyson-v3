import { applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import logger from 'redux-logger';
import epics from './epics';
import vertxMiddleware from '../views/components/vertx/vertx.middleware';
import navigationMiddleware from '../views/routing/navigation.middleware';
import sidebarMiddleware from '../views/routing/sidebar/sidebar.middleware';

const epicMiddleware = createEpicMiddleware( epics );
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const developmentMiddleware = [
  epicMiddleware,
  vertxMiddleware,
  navigationMiddleware,
  sidebarMiddleware,
  logger,
];

const productionMiddleware = [
  epicMiddleware,
  vertxMiddleware,
  navigationMiddleware,
  sidebarMiddleware,
];

export default composeEnhancers( applyMiddleware(
  ...( process.env.NODE_ENV === 'production' )
    ? productionMiddleware
    : developmentMiddleware
));
