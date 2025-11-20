const { getDefaultConfig } = require('expo/metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);

  // add .bin to asset extensions
  config.resolver.assetExts.push('bin');

  return config;
})();
