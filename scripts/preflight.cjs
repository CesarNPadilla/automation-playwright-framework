require('./register-typescript.cjs');
const { config, validateCredentials } = require('../config/index.ts');
validateCredentials();
console.log(`Ready for ${config.env}: ${new URL(config.baseUrl).hostname}`);
console.log('Local configuration only: tenant permissions, resource existence, and connectivity are not verified.');
