const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, errors, printf, json } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
  });

const logger = createLogger({

    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({stack: true}),
        myFormat
    ),
    transports: [
       new transports.Console(),
       new transports.File({ filename: './utility/error.log', level: 'error' }),
       new transports.File({ filename: './utility/info.log', level: 'info' })
    ],
  });

  module.exports = logger