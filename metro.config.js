// const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
// const path = require('path');

// module.exports = mergeConfig(getDefaultConfig(__dirname), {
//   resolver: {
//     extraNodeModules: {
//       crypto: require.resolve('react-native-crypto'),
//       stream: require.resolve('stream-browserify'),
//       vm: require.resolve('vm-browserify'),
//       events: require.resolve('events'),
//     },
//   },
//   transformer: {
//     getTransformOptions: async () => ({
//       transform: {
//         experimentalImportSupport: false,
//         inlineRequires: false,
//       },
//     }),
//   },
// });
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      crypto: require.resolve('react-native-crypto'),
      stream: require.resolve('stream-browserify'),
      vm: require.resolve('vm-browserify'),
      buffer: require.resolve('buffer'),
    },
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
