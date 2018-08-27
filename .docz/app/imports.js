export const imports = {
  'src/index.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-index" */ 'src/index.mdx'),
  'src/views/components/box/Box.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-views-components-box-box" */ 'src/views/components/box/Box.mdx'),
}
