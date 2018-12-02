import Config from './config';

export { default as routes } from './routes';
export { default as sidebar } from './sidebar';

export default {
  app: {
    name: Config.APP_NAME,
  },
  genny: {
    host: Config.GENNY_HOST,
    initUrl: Config.GENNY_INITURL,
    bridge: {
      port: Config.GENNY_BRIDGE_PORT,
      endpoints: {
        vertex: Config.GENNY_BRIDGE_VERTEX,
        service: Config.GENNY_BRIDGE_SERVICE,
        events: Config.GENNY_BRIDGE_EVENTS,
      },
    },
  },
  signature: {
    url: Config.SIGNATURE_URL,
  },  
  google: {
    apiKey: Config.GOOGLE_MAPS_APIKEY,
    maps: {
      apiUrl: Config.GOOGLE_MAPS_APIURL,
    },
  },
  uppy: {
    url: Config.UPPY_URL,
  },
  keycloak: {
    redirectUri: Config.KEYCLOAK_REDIRECTURI,
  },
  layouts: {
    publicURL: Config.LAYOUT_PUBLICURL,
    query: {
      directory: Config.LAYOUT_QUERY_DIRECTORY,
    },
  },
  guest: {
    username: Config.GUEST_USERNAME,
    password: Config.GUEST_PASSWORD,
  },
};
