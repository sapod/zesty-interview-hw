const config = require('./config');

const LOG_TYPES = { DEBUG: 'DEBUG', INFO: 'INFO', ERROR: 'ERROR', FATAL: 'FATAL' };

function write_log(type, message, error, error_stack) {
    if (type === LOG_TYPES.DEBUG && !config.should_log_debug)
        return;

    if(error)
        console.log({ type, message, error, stack: error_stack });
    else
        console.log({ type, message });
}

module.exports = {
    LOG_TYPES,
    write_log
}