module.exports = function override(config, env) {
  config.resolve.plugins = config.resolve.plugins.filter(
    plugin => plugin.constructor.name !== "ModuleScopePlugin"
  );
  return config;
};
