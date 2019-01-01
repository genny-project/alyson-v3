import config from './config';

export { default as routes } from './routes';
export { default as sidebar } from './sidebar';

const { protocol, hostname, port } = window.location;

/*  /api/events/init?url=${protocol + hostname}
    this is how we pass the current website to the bridge  */
/*
    nginx is setup on kubernets to get the url which
    allows us to get the site and project specific variables */

const currentUrl = `${protocol}//${hostname}:${port}`;
const fullUrl = `${currentUrl}/api/events/init?url=${currentUrl}`;

// const fullUrl = 'https://bridge-internmatch-staging.outcome-hub.com/api/events/init?url=https://app3-internmatch-staging.outcome-hub.com';
console.warn({ fullUrl }); //eslint-disable-line
export default {
  ...config,
  genny: {
    host: fullUrl || process.env.ENV_GENNY_INIT_URL,
    bridge: {
      port: process.env.GENNY_BRIDGE_PORT || 8080,
      endpoints: {
        vertex: 'frontend',
        service: 'api/service',
        events: 'api/events',
      },
    },
  },
};
