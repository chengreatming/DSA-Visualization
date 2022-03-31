import store, { getModule } from './store/index.js';
import windowResizeHandler from './eventListeners/windowResizeHandler.js';

/**
 * Merges the provided configuration with default values and returns a
 * configured P3dTools instance.
 * @export
 * @public
 * @method
 * @name init
 *
 * @param {Object|Object[]} [defaultConfiguration = {}] The configuration to apply. Assumed globalConfiguration
 * only one value, otherwise moduleName, configuration entires in an array.
 * @returns {Object} A configured CornerstoneTools instance with top level API members.
 */
export default function (defaultConfiguration = {}) {
  _initModules();

  const globalConfigurationModule = getModule('globalConfiguration');

  if (Array.isArray(defaultConfiguration)) {
    defaultConfiguration.forEach(configurationEntry => {
      const { moduleName, configuration } = configurationEntry;

      const module = getModule(moduleName);

      if (module) {
        module.configuration = Object.assign(
          {},
          module.configuration,
          configuration
        );
      }
    });
  } else {
    // defaultConfiguration is an object, default to assigning it to globalConfiguration.
    globalConfigurationModule.configuration = Object.assign(
      {},
      globalConfigurationModule.configuration,
      defaultConfiguration
    );
  }

  // if (globalConfigurationModule.configuration.autoResizeViewports) {
  //   windowResizeHandler.enable();
  // }
}


/*
 * TODO: This could cause issues if the module was already initialized for
 * the store. As there's nothing stopping implementers from calling `init`
 * multiple times. Modules should self-check if they have already been
 * registered to prevent issues.
 */

/**
 * Iterate over our store's modules. If the module has an `onRegisterCallback`
 * call it. This hook can be used to setup any global store requirements per
 * module.
 * @private
 * @method
 * @returns {void}
 */
function _initModules() {
  const modules = store.modules;

  Object.keys(modules).forEach(function (key) {
    if (typeof modules[key].onRegisterCallback === 'function') {
      modules[key].onRegisterCallback();
    }
  });
}
