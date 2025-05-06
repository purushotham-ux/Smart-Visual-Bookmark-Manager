/**
 * This file is not used directly by react-scripts, but will be used when you run "npm run eject"
 * to customize the webpack configuration.
 * 
 * This addresses the following deprecation warnings:
 * - 'onAfterSetupMiddleware' option is deprecated. Please use the 'setupMiddlewares' option.
 * - 'onBeforeSetupMiddleware' option is deprecated. Please use the 'setupMiddlewares' option.
 */

module.exports = {
  // The webpack configuration will be handled by react-scripts
  // This file exists to provide guidance for after ejection
  
  // After ejecting, replace the deprecated options in the webpack.config.js file with:
  /*
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      // Your custom middleware setup here
      return middlewares;
    }
  }
  */
}; 