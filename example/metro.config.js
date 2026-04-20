const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');
const { getConfig } = require('react-native-builder-bob/metro-config');
const pkg = require('../package.json');

const root = path.resolve(__dirname, '..');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

// react-native-builder-bob's getConfig sets watchFolders: [root], which
// replaces Expo's default watchFolders. We merge both to satisfy expo-doctor.
const bobConfig = getConfig(defaultConfig, {
  root,
  pkg,
  project: __dirname,
});

const expoWatchFolders = defaultConfig.watchFolders ?? [];
const bobWatchFolders = bobConfig.watchFolders ?? [];

// Deduplicate: combine Expo defaults + builder-bob root folder
const mergedWatchFolders = [
  ...new Set([...expoWatchFolders, ...bobWatchFolders]),
];

module.exports = {
  ...bobConfig,
  watchFolders: mergedWatchFolders,
};
