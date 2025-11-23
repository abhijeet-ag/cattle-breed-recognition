const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add 'bin' to the list of supported assets for TensorFlow.js
config.resolver.assetExts.push(
  'bin', 
  'json' 
);

module.exports = config;
