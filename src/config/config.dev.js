export default {
  app: {
    name: 'Genny',
  },
  genny: {
    host: 'http://localhost:8088',
    bridge: {
      port: '8088',
      endpoints: {
        vertex: 'frontend',
        service: 'api/service',
        events: 'api/events',
      },
    },
  },
};
