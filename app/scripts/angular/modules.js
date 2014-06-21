'use strict';
 /**
 * modules
 * @author Dennis Sänger, 2013
 */

require('./misc/401-interceptor');

// DIRECTIVES


// SERVICES
require('./services/domain');
require('./services/user');
require('./services/address');
require('./services/blocked');
require('./services/maildir');


// CONTROLLER
require('./controller/app');
require('./controller/nav');
require('./controller/login');
require('./controller/domain');
require('./controller/user');
require('./controller/address');
require('./controller/blocked');
