
requirejs.config({
  baseUrl: 'lib',
  paths: {
    client: '../client',
    shared: '../shared'
  }
});
requirejs(['client/main']);
