
var require = {
  baseUrl: 'lib',
  shim: {
    'threeCore': { exports: 'THREE' },
    'threePlugins': { deps: ['threeCore'], exports: 'THREE' }
  },
  paths: {
    threeCore: 'three.min',
    client: '../client',
    shared: '../shared'
  }
}
