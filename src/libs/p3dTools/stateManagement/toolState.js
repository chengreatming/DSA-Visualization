import EVENTS from '../events.js';
import { globalImageIdSpecificToolStateManager } from './imageIdSpecificStateManager.js';
import triggerEvent from '../util/triggerEvent.js';
import getEnabledElement from '../store/getEnabledElement'
/**
 * Returns the toolstate for a specific element.
 * @public
 * @function getElementToolStateManager
 *
 * @param  {HTMLElement} element The element.
 * @returns {Object} The toolState.
 */
function getElementToolStateManager(element) {
  const enabledElement = getEnabledElement(element);

  // If the enabledElement has no toolStateManager, create a default one for it
  // NOTE: This makes state management element specific

  if (enabledElement.toolStateManager === undefined) {
    enabledElement.toolStateManager = globalImageIdSpecificToolStateManager;
  }

  return enabledElement.toolStateManager;
}

/**
 * Adds tool state to the toolStateManager, this is done by tools as well
 * as modules that restore saved state.
 * @public
 * @method addToolState
 *
 * @param  {HTMLElement} element  The element.
 * @param  {string} toolType      The toolType of the state.
 * @param  {Object} measurementData The data to store in the state.
 * @returns {undefined}
 */
function addToolState(element, toolType, measurementData, currentPoints) {
  const toolStateManager = getElementToolStateManager(element);

  toolStateManager.add(element, toolType, measurementData);
  selecteToolState(element, measurementData)
  const eventType = EVENTS.MEASUREMENT_ADDED;
  const eventData = {
    toolName: toolType,
    toolType,
    element,
    measurementData,
    currentPoints
  };


  triggerEvent(element, eventType, eventData);
}

function selecteToolState(element, measurementData) {
  const toolStateManager = getElementToolStateManager(element);
  for (let imageId in toolStateManager.toolState) {
    const imageToolState = toolStateManager.toolState[imageId]
    for (let toolType in imageToolState) {
      const toolData = imageToolState[toolType]
      toolData.data.forEach(data => {
        const eventData = {
          toolName: toolType,
          toolType,
          element,
          measurementData: data
        };
        if (data === measurementData && !data.selected) {
          data.selected = true
          data.needUpdate = true
          triggerEvent(element, EVENTS.MEASUREMENT_SELECTED, eventData);
        }
        if (data !== measurementData && data.selected) {
          data.needUpdate = true
          data.selected = false
          triggerEvent(element, EVENTS.MEASUREMENT_UNSELECTED, eventData);
        }
      })
    }
  }

}

function deleteSelecteToolState(element) {
  const toolStateManager = getElementToolStateManager(element);
  for (let imageId in toolStateManager.toolState) {
    const imageToolState = toolStateManager.toolState[imageId]
    for (let toolType in imageToolState) {
      const toolData = imageToolState[toolType]
      toolData.data.forEach(data => {
        if (data.selected) {
          removeToolState(element, toolType, data)
        }
      })
    }
  }
}
/**
 * Returns tool specific state of an element. Used by tools as well as modules
 * that save state persistently
 * @export
 * @public
 * @method
 * @name getToolState
 *
 * @param  {HTMLElement} element The element.
 * @param  {string} toolType The toolType of the state.
 * @returns {Object}          The element's state for the given toolType.
 */
function getToolState(element, toolType) {
  const toolStateManager = getElementToolStateManager(element);

  return toolStateManager.get(element, toolType);
}

/**
 * Removes specific tool state from the toolStateManager.
 * @public
 * @method removeToolState
 *
 * @param  {HTMLElement} element  The element.
 * @param  {string} toolType      The toolType of the state.
 * @param  {Object} data          The data to remove from the toolStateManager.
 * @returns {undefined}
 */
function removeToolState(element, toolType, data) {
  const toolStateManager = getElementToolStateManager(element);
  const toolData = toolStateManager.get(element, toolType);
  // Find this tool data
  let indexOfData = -1;
  for (let i = 0; i < toolData.data.length; i++) {
    if (toolData.data[i] === data) {
      indexOfData = i;
    }
  }

  if (indexOfData !== -1) {
    toolData.data.splice(indexOfData, 1);

    const eventType = EVENTS.MEASUREMENT_REMOVED;
    const eventData = {
      toolName: toolType,
      toolType,
      element,
      measurementData: data,
    };

    triggerEvent(element, eventType, eventData);
  }
}

/**
 * Removes all toolState from the toolStateManager corresponding to
 * the toolType and element.
 * @public
 * @method clearToolState
 *
 * @param  {HTMLElement} element  The element.
 * @param  {string} toolType      The toolType of the state.
 * @returns {undefined}
 */
function clearToolState(element, toolType) {
  const toolStateManager = getElementToolStateManager(element);
  const toolData = toolStateManager.get(element, toolType);

  // If any toolData actually exists, clear it
  if (toolData !== undefined) {
    toolData.data = [];
  }
}

/**
 * Sets the tool state manager for an element
 * @public
 * @method setElementToolStateManager
 *
 * @param  {HTMLElement} element The element.
 * @param {Object} toolStateManager The toolStateManager.
 * @returns {undefined}
 */
function setElementToolStateManager(element, toolStateManager) {
  const enabledElement = getEnabledElement(element);

  enabledElement.toolStateManager = toolStateManager;
}

export {
  addToolState,
  getToolState,
  removeToolState,
  clearToolState,
  selecteToolState,
  deleteSelecteToolState,
  setElementToolStateManager,
  getElementToolStateManager,
};
