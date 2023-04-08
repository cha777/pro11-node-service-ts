import Logger from '../libs/logger';
const logger = new Logger('extended-err-handler');

/**
 * Extend uncaught exceptions from the process
 * Log reason to the application log
 */

process.on('unhandledRejection', (reason, p) => {
  const message = `Global Error Handler - ${reason}: Unhandled Rejection at Promise' ${p}`;

  console.error(message);
  logger.err(message);
});

process.on('uncaughtException', (err) => {
  const message = `Global Error Handler - UncaughtException  ${
    err.message ? err.message : err
  }`;

  console.error(message);
  logger.err(message);
});
