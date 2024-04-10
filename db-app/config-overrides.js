const webpack = require("webpack");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};

  Object.assign(fallback, {
    // ENABLE OR DISABLE YOUR POLYFILLS HERE
    stream: require.resolve("stream-browserify"),
    zlib: require.resolve("browserify-zlib"),
    querystring: require.resolve("querystring-es3"),
    path: require.resolve("path-browserify"),
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    http: require.resolve("stream-http"),
    buffer: require.resolve("buffer/"),
    util: require.resolve("util/"),
    url: require.resolve("url/"),
    assert: require.resolve("assert/"),
    vm: require.resolve("vm-browserify"),
    fs: false,
    timers: require.resolve("timers-browserify"),
    os: require.resolve("os-browserify/browser"),
    dgram: false,
  });

  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  config.resolve.extensions.push(".mjs");
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  });

  return config;
};