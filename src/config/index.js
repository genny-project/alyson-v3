import config from './config';

export { default as routes } from './routes';
export { default as sidebar } from './sidebar';

const { protocol, hostname } = window.location;

/*  /api/events/init?url=${protocol + hostname} 
    this is how we pass the current website to the bridge  */
/* 
    nginx is setup on kubernets to get the url which 
    allows us to get the site and project specific variables */

const fullUrl = `${protocol + hostname}/api/events/init?url=${protocol + hostname}`;

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
