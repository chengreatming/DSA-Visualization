import {
  mouseEventListeners,
  wheelEventListener,
} from '../../eventListeners/index.js';
import {
  mouseToolEventDispatcher,
} from '../../eventDispatchers/index.js';
import store, { getModule } from '../index.js';
// import loadHandlerManager from '../../stateManagement/loadHandlerManager.js';

/**
 * Element Disabled event.
 *
 * @event Cornerstone#ElementDisabled
 * @type {Object}
 * @property {string} type
 * @property {Object} detail
 * @property {HTMLElement} detail.element - The element being disabled.
 */

/**
 * Removes an enabledElement from our store, and all associated tools that were added to it.
 * @export
 * @private
 * @method
 * @name removeEnabledElement
 * @param {Cornerstone#ElementDisabled} elementDisabledEvt
 * @listens Cornerstone#ElementDisabled
 * @returns {void}
 */
export default function (elementDisabledEvt) {
  console.log('EVENT:ELEMENT_DISABLED');
  const enabledElement = elementDisabledEvt.detail.element;
  const { configuration } = getModule('globalConfiguration');

  // Mouse
  if (configuration.mouseEnabled) {
    mouseEventListeners.disable(enabledElement);
    wheelEventListener.disable(enabledElement);
    mouseToolEventDispatcher.disable(enabledElement);
  }

  // Touch
  if (configuration.touchEnabled) {
    // touchEventListeners.disable(enabledElement);
    // touchToolEventDispatcher.disable(enabledElement);
  }

  // State
  _removeAllToolsForElement(enabledElement);
  _removeEnabledElement(enabledElement);
  _removeLoadHandlers(enabledElement);
}

/**
 * Remove all tools associated with enabled element.
 * @private
 * @method
 * @param {HTMLElement} enabledElement
 * @returns  {void}
 */
const _removeAllToolsForElement = function (enabledElement) {
  // Note: We may want to `setToolDisabled` before removing from store
  // Or take other action to remove any lingering eventListeners/state
  store.state.tools = store.state.tools.filter(
    tool => tool.element !== enabledElement
  );
};

/**
 * Remove the enabled element from the store if it exists.
 * @private
 * @method
 * @param {HTMLElement} enabledElement
 * @returns {void}
 */
const _removeEnabledElement = function (enabledElement) {
  if (store.modules) {
    _cleanModulesOnElement(enabledElement);
  }

  const foundElementIndex = store.state.enabledElements.findIndex(
    element => element === enabledElement
  );

  if (foundElementIndex > -1) {
    store.state.enabledElements.splice(foundElementIndex, 1);
  } else {
    console.warn('unable to remove element');
  }
};

/**
 * Remove load handler for the element
 * @private
 * @method
 * @param {HTMLElement} element
 * @returns {void}
 */
const _removeLoadHandlers = function (element) {
  // loadHandlerManager.removeHandlers(element);
};

/**
 * Iterate over our store's modules. If the module has a
 * `removeEnabledElementCallback` call it and clean up unneeded metadata.
 * @private
 * @method
 * @param  {Object} enabledElement
 * @returns {void}
 */
function _cleanModulesOnElement(enabledElement) {
  const modules = store.modules;

  Object.keys(modules).forEach(function (key) {
    if (typeof modules[key].removeEnabledElementCallback === 'function') {
      modules[key].removeEnabledElementCallback(enabledElement);
    }
  });
}
