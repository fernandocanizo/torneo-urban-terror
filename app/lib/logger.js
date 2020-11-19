const rfr = require('rfr');
const process = require('process');
const { combine, timestamp, printf } = require('logform').format;
const { createLogger, transports, format } = require('winston');

const at = rfr('/app/lib/at');


const { LOG_LEVEL: logLevel, NODE_ENV: nodeEnvironment } = process.env;

let logger;
const isProduction = 'production' === nodeEnvironment;

if (isProduction) {
  // Save logs into files in `production`
  logger = createLogger({
    level: logLevel || 'error',
    format: combine(
      timestamp(),
      printf(o => `${o.timestamp} [${o.level}] ${o.message}`)
    ),
    transports: [
      new transports.File({ filename: 'log/error.log', level: 'error' }),
      new transports.File({ filename: 'log/full.log' }),
    ],
    exceptionHandlers: [
      new transports.File({ filename: 'log/exceptions.log' }),
    ],
  });
} else {
  // only show logs on the console in `development`
  logger = createLogger({
    level: logLevel || 'debug',
    format: combine(
      format.colorize(),
      timestamp(),
      printf(o => `[${o.level}] ${o.message}`)
    ),
    transports: [
      new transports.Console(),
    ],
    exceptionHandlers: [
      new transports.Console(),
    ],
  });
}

const logLevels = [
  'error',
  'warn',
  'info',
  'http',
  'verbose',
  'debug',
  'silly',
];

// Build a function for every log level
module.exports = logLevels.reduce((o, level) => {
  o[level] = msg => logger[level](at(msg, 3));
  return o;
}, {});
