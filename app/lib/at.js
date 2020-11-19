const rfr = require('rfr');
const arr2string = (arr) => `[ ${arr.join(', ')} ]`;

const obj2string = (o) => JSON.stringify(o, null, 2);

// Tell us the exact file and line where the function was invoked via a
// self produced exception
const at = (msg = '') => {
  const where = new Error().stack
    .split(/\n/)
    .filter(v => v.match(rfr.root) && !v.match(/node_modules|at.js|logger.js/))
    .find(v => v).trim()
    .replace(rfr.root, './');

  if (Array.isArray(msg)) {
    return `${where}\n${arr2string(msg)}`;
  } else if ('object' === typeof msg) {
    return (msg instanceof Error) ? `${where}\n${msg.stack}` : `${where}\n${obj2string(msg)}`;
  } else if (msg) {
    return `${where}\n${msg}`;
  } else {
    return `${where}`;
  }
};


module.exports = at;
