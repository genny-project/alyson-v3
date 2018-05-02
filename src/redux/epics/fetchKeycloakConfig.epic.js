import { Observable } from 'rxjs/Observable';
import { KEYCLOAK_CONFIG_FETCH_REQUEST } from '../../constants';
import { Api } from '../../utils';
import { fetchKeycloakConfigSuccess, fetchKeycloakConfigFailure } from '../../redux/actions';

const fetchKeycloakConfig = action$ =>
  action$
    .ofType( KEYCLOAK_CONFIG_FETCH_REQUEST )
    .mergeMap(() => (
      Api.getKeycloakConfig()
        .map( success => (
          fetchKeycloakConfigSuccess( success.response )
        ))
        .catch( error => (
          Observable.of(
            fetchKeycloakConfigFailure( error )
          )
        ))
    ));

export default fetchKeycloakConfig;
