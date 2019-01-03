const { protocol, hostname, port } = window.location;
const currentUrl = `${protocol}//${hostname}:${port}`;

export default {
  genny: {
    host: process.env.ENV_GENNY_BRIDGE_URL || currentUrl,
  },
};
