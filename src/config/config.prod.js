export default {
  app: {
    name: 'Genny',
  },
  genny: {
    host: 'https://bridge-fourdegrees-dev.outcome-hub.com/',
    initUrl: 'https://fourdegrees-dev.outcome-hub.com/',
    bridge: {
      port: '80',
      endpoints: {
        vertex: 'frontend',
        service: 'api/service',
        events: 'api/events',
      },
    },
  },
  google: {
    apiKey: 'AIzaSyC5HjeRqeoqbxHEQWieE0g9hLaN6snjorA',
    maps: {
      apiUrl: 'https://maps.googleapis.com/maps/api/js',
    },
  },
  uppy: {
    url: 'https://uppych40.channel40.com.au/s3/',
  },
  keycloak: {
    redirectUri: 'https://d2oki2ya5fhih0.cloudfront.net',
  },
  layouts: {
    publicURL: 'https://layout-fourdegrees-dev.outcome-hub.com/',
    query: {
      directory: 'layouts/pcss-new',
    },
  },
};
