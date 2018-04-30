import { applyMiddleware } from 'redux';
import logger from 'redux-logger';

const developmentMiddleware = [
  logger,
];

const productionMiddleware = [

];

export default applyMiddleware(
  ...( process.env.NODE_ENV === 'production' )
    ? productionMiddleware
    : developmentMiddleware
);
