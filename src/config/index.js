import platformSpecificConfig from './config';

export { default as routes } from './routes';

// The reason we're using `require` instead of `import`?
// See: https://github.com/webpack/webpack/issues/6584
const merge = require( 'deepmerge' );

/*  /api/events/init?url=${protocol + hostname}
    this is how we pass the current website to the bridge  */
/*
    nginx is setup on kubernets to get the url which
    allows us to get the site and project specific variables */

const globalConfig = {
  genny: {
    host: process.env.ENV_GENNY_BRIDGE_URL,
    bridge: {
      port: process.env.ENV_GENNY_BRIDGE_PORT || 8080,
      endpoints: {
        vertex: 'frontend',
        service: 'api/service',
        events: 'api/events',
      },
    },
  },
};

/* Allow the platform specific config to overwrite any global config keys. */
export default merge( globalConfig, platformSpecificConfig );
