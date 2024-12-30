const { override } = require('customize-cra');

module.exports = override((config) => {
    // Ensure devServer is defined
    if (!config.devServer) {
        config.devServer = {};
    }
    config.devServer.allowedHosts = 'all'; // Allow all hosts
    return config;
});