import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import identity from 'lodash.identity';

if (canUseDOM && process.env.NODE_ENV !== 'production') {
  module.exports = require('./loggerMiddleware.dev.js');
}
else {
  module.exports = () => identity;
}
