#!/usr/bin/env node

const rfr = require('rfr');
const debug = require('debug')('tut:server');
const http = require('http');
const process = require('process');

const app = rfr('/index.js');


const port = process.env.PORT || '3000';
app.set('port', port);

const onError = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${port} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${port} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const address = server.address();
  console.info(`Listening on http://localhost:${address.port}/`);
};

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
