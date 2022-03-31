/**
 * Internal module used to turn on listening, handling, and normalizing of the
 * native `wheel` event
 */

import EVENTS from '../events.js';
import triggerEvent from '../util/triggerEvent.js';
import normalizeWheel from './internals/normalizeWheel.js';
import getEnabledElement from '../store/getEnabledElement'
/**
 *
 * @private
 * @function wheelEventHandler
 * @param {WheelEvent} evt
 * @returns {undefined}
 */
function wheelEventHandler(evt) {
  const element = evt.currentTarget;

  // Prevent triggering MouseWheel events that are not real scroll events:
  // E.g. when clicking the MiddleMouseWheelButton, a deltaY of 0 is emitted.
  // See https://github.com/cornerstonejs/cornerstoneTools/issues/935
  if (evt.deltaY > -1 && evt.deltaY < 1) {
    return;
  }
  evt.preventDefault();
  const enabledElement = getEnabledElement(element)

  if (!enabledElement || !enabledElement.scene) return false

  const { pageX, pageY } = evt;
  const startingCoords = null;
  const { spinX, spinY, pixelX, pixelY } = normalizeWheel(evt);
  const direction = spinY < 0 ? -1 : 1;

  const mouseWheelData = {
    element,
    enabledElement,
    detail: evt,
    direction,
    spinX,
    spinY,
    pixelX,
    pixelY,
    pageX,
    pageY,
  };

  triggerEvent(element, EVENTS.MOUSE_WHEEL, mouseWheelData);
}

/**
 * Listens for the wheel event, and handles it. Handled event
 * will be "normalized" and re-emitted as `EVENTS.MOUSE_WHEEL`
 *
 * @private
 * @param {HTMLElement} element
 * @returns {undefined}
 */
function enable(element) {
  disable(element);
  element.addEventListener('wheel', wheelEventHandler, { passive: false });
}

/**
 * Removes listener and handler for wheel event. `EVENTS.MOUSE_WHEEL`
 * will no longer be emitted.
 *
 * @private
 * @param {HTMLElement} element
 * @returns {undefined}
 */
function disable(element) {
  element.removeEventListener('wheel', wheelEventHandler, { passive: false });
}

export default {
  enable,
  disable,
};
