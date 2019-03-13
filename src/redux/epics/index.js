import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import { combineEpics } from 'redux-observable';
import { default as fetchKeycloakConfig } from './fetchKeycloakConfig.epic';
// import { default as fetchPublicLayouts } from './fetchPublicLayouts.epic';

const epics = combineEpics(
  fetchKeycloakConfig,
  // fetchPublicLayouts,
);

export default epics;
