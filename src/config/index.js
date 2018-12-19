import config from './config';

export { default as routes } from './routes';
export { default as sidebar } from './sidebar';

const { protocol, hostname } = window.location;

export default {
  ...config,
  genny: {
    host: process.env.GENNY_HOST_URL || `${protocol}//${hostname}`,
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
