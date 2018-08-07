import { Observable } from 'rxjs/Observable';
import { KEYCLOAK_CONFIG_FETCH_SUCCESS } from '../../constants';
import { Api } from '../../utils';
import { fetchPublicLayoutsSuccess, fetchPublicLayoutsFailure } from '../../redux/actions';

const fetchPublicLayouts = action$ =>
  action$
    .ofType( KEYCLOAK_CONFIG_FETCH_SUCCESS )
    .mergeMap(() => (
      Api.getPublicLayouts()
        .map( success => (
          fetchPublicLayoutsSuccess( success.response )
        ))
        .catch( error => (
          Observable.of(
            fetchPublicLayoutsFailure( error )
          )
        ))
    ));

export default fetchPublicLayouts;
