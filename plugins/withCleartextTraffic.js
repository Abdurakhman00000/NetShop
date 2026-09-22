const {
  withAndroidManifest,
  AndroidConfig,
} = require('expo/config-plugins');

/**
 * Ensures release builds allow cleartext HTTP (needed for http:// API hosts).
 * Expo's usesCleartextTraffic often lands only on debug manifests.
 */
function withCleartextTraffic(config) {
  return withAndroidManifest(config, (config) => {
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);
    app.$['android:usesCleartextTraffic'] = 'true';
    app.$['android:networkSecurityConfig'] = '@xml/network_security_config';
    return config;
  });
}

module.exports = withCleartextTraffic;
