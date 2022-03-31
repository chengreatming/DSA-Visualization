import {
  mouseEventListeners,
  wheelEventListener,
} from '../../eventListeners/index.js';
import {
  mouseToolEventDispatcher,
} from '../../eventDispatchers/index.js';
import { addToolForElement } from './../addTool.js';
import {
  setToolActiveForElement,
  setToolPassiveForElement,
  setToolEnabledForElement,
  setToolDisabledForElement,
} from './../setToolMode.js';
import store, { getModule } from '../index.js';
/**
 * Element Enabled event.
 *
 * @event Cornerstone#ElementEnabled
 * @type {Object}
 * @property {string} type
 * @property {Object} detail
 * @property {HTMLElement} detail.element - The element being enabled.
 */

/* TODO: It would be nice if this automatically added "all tools"
 * To the enabledElement that already exist on all other tools.
 * A half-measure might be a new method to "duplicate" the tool
 * Configuration for an existing enabled element
 * We may need to also save/store the original class/constructor per tool
 * To accomplish this
 */
/**
 * Adds an enabledElement to our store.
 * @export
 * @private
 * @method
 * @name addEnabledElement
 * @param {obj} include camera & domelment
 * @listens p3d#ElementEnabled
 * @returns {void}
 */
export default function (enabledElement = {}) {
  const { domElement, camera } = enabledElement
  if (!domElement || !camera) return false
  // Dispatchers

  const { configuration } = getModule('globalConfiguration');

  // Mouse
  if (configuration.mouseEnabled) {
    mouseEventListeners.enable(domElement);
    wheelEventListener.enable(domElement);
    mouseToolEventDispatcher.enable(domElement);
  }

  // Touch
  if (configuration.touchEnabled) {
    // touchEventListeners.enable(domElement);
    // touchToolEventDispatcher.enable(domElement);
  }

  // State
  _addEnabledElement(enabledElement);
}

/**
 * Adds the enabled element to the store.
 * @private
 * @method
 * @param {HTMLElement} enabledElement
 * @returns {void}
 */
const _addEnabledElement = function (enabledElement) {
  store.state.enabledElements.push(enabledElement);
  if (store.modules) {
    _initModulesOnElement(enabledElement);
  }
  _addGlobalToolsToElement(enabledElement);
  _repeatGlobalToolHistory(enabledElement);
};

/**
 * Iterate over our store's modules. If the module has an `enabledElementCallback`
 * call it and pass it a reference to our enabled element.
 * @private
 * @method
 * @param  {Object} enabledElement
 * @returns {void}
 */
function _initModulesOnElement(enabledElement) {
  const modules = store.modules;

  Object.keys(modules).forEach(function (key) {
    if (typeof modules[key].enabledElementCallback === 'function') {
      modules[key].enabledElementCallback(enabledElement);
    }
  });
}

/**
 * Iterate over our stores globalTools adding each one to `enabledElement`
 * @private
 * @method
 * @param {HTMLElement} enabledElement
 * @returns {void}
 */
function _addGlobalToolsToElement(enabledElement) {
  const { configuration } = getModule('globalConfiguration');

  if (!configuration.globalToolSyncEnabled) {
    return;
  }

  Object.keys(store.state.globalTools).forEach(function (key) {
    const { tool, props } = store.state.globalTools[key];

    addToolForElement(enabledElement, tool, props);
  });
}

/**
 * Iterate over the globalToolChangeHistory and apply each `historyEvent`
 * to the supplied `enabledElement`.
 * @private
 * @method
 * @param {HTMLElement} enabledElement
 * @returns {void}
 */
function _repeatGlobalToolHistory(enabledElement) {
  const { configuration } = getModule('globalConfiguration');

  if (!configuration.globalToolSyncEnabled) {
    return;
  }

  const setToolModeFns = {
    active: setToolActiveForElement,
    passive: setToolPassiveForElement,
    enabled: setToolEnabledForElement,
    disabled: setToolDisabledForElement,
  };

  store.state.globalToolChangeHistory.forEach(historyEvent => {
    const args = historyEvent.args.slice(0);

    args.unshift(enabledElement);
    setToolModeFns[historyEvent.mode].apply(null, args);
  });
}
