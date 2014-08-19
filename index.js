'use strict';

var port = process.argv.length > 2
         ? parseInt (process.argv[2])
         : 1234;

var server = require ('http').createServer (handler);
var fs = require ('fs');
var path = require ('path');

var wwwPrefix = path.join (__dirname, 'www');

function handler (req, res) {
  var requestPath = req.url;
  if (requestPath === '/') requestPath = '/index.html';
  var normalizedPath = path.normalize (wwwPrefix + requestPath);

  if (normalizedPath.indexOf (wwwPrefix) !== 0) {
    res.writeHead (403);
    return res.end ('403');
  } else if (! fs.existsSync (normalizedPath)) {
    res.writeHead (404);
    return res.end ('404');
  }

  fs.readFile (normalizedPath, function (err, data) {
    if (err) {
      res.writeHead (500);
      return res.end ('500');
    }
    res.writeHead (200);
    return res.end (data);
  });
}

var game = require ('./www/js/shared/game.js');
require ('gamesync').run (server, game);
server.listen (port);

