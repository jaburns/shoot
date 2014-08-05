'use strict';

var port = process.argv.length > 2
         ? parseInt (process.argv[2])
         : 1234;

var server = require ('http').createServer (handler);
var fs = require ('fs');

function handler (req, res) {
  var filepath = req.url;

  if (filepath === '/') filepath = '/index.html';
  filepath = '/www/' + filepath;

  if (FILES.indexOf (filepath) < 0) {
    res.writeHead (404);
    return res.end ('404');
  }

  fs.readFile (__dirname + filepath, function (err, data) {
    if (err) {
      res.writeHead (500);
      return res.end ('500');
    }
    res.writeHead (200);
    return res.end (data);
  });
}

var game = require ('./www/game.js');
require ('gamesync').run (server, game, lag);
server.listen (port);
