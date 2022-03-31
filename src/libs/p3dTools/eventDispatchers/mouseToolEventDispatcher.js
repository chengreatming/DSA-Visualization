import EVENTS from './../events.js';
import {
  mouseClick,
  mouseDown,
  mouseDownActivate,
  mouseDoubleClick,
  mouseDrag,
  mouseMove,
  mouseUp,
  mouseWheel,
  measurementAdded,
  measurementModified,
  measurementModifyCompleted,
  measurementRemoved,
  measurementCompleted,
  measurementHandleActiveChanged,
  measurementActiveChanged,
  measurementSelected,
  measurementUnselected
} from './mouseEventHandlers/index.js';

/**
 * These listeners are emitted in order, and can be cancelled/prevented from bubbling
 * by any previous event.
 * - mouseMove: used to update the [un]hover state of a tool (highlighting)
 * - mouseDown: check to see if we are close to an existing annotation, grab it
 * - mouseDownActivate: createNewMeasurement (usually)
 * - mouseDrag: update measurement or apply strategy (wwwc)
 * - mouseDoubleClick: usually a one-time apply specialty action
 * - onImageRendered: redraw visible tool data
 * @private
 * @param {*} element
 * @returns {undefined}
 */
const enable = function (element) {
  element.addEventListener(EVENTS.MOUSE_CLICK, mouseClick);
  element.addEventListener(EVENTS.MOUSE_DOWN, mouseDown);
  element.addEventListener(EVENTS.MOUSE_DOWN_ACTIVATE, mouseDownActivate);
  element.addEventListener(EVENTS.MOUSE_DOUBLE_CLICK, mouseDoubleClick);
  element.addEventListener(EVENTS.MOUSE_DRAG, mouseDrag);
  element.addEventListener(EVENTS.MOUSE_MOVE, mouseMove);
  element.addEventListener(EVENTS.MOUSE_UP, mouseUp);
  element.addEventListener(EVENTS.MOUSE_WHEEL, mouseWheel);
  element.addEventListener(EVENTS.MEASUREMENT_ADDED, measurementAdded);
  element.addEventListener(EVENTS.MEASUREMENT_MODIFIED, measurementModified);
  element.addEventListener(EVENTS.MEASUREMENT_MODIFY_COMPLETED, measurementModifyCompleted);
  element.addEventListener(EVENTS.MEASUREMENT_REMOVED, measurementRemoved);
  element.addEventListener(EVENTS.MEASUREMENT_COMPLETED, measurementCompleted);
  element.addEventListener(EVENTS.MEASUREMENT_HANDLE_ACTIVE_CHANGED, measurementHandleActiveChanged);
  element.addEventListener(EVENTS.MEASUREMENT_ACTIVE_CHANGED, measurementActiveChanged);
  element.addEventListener(EVENTS.MEASUREMENT_SELECTED, measurementSelected);
  element.addEventListener(EVENTS.MEASUREMENT_UNSELECTED, measurementUnselected);
};

const disable = function (element) {
  element.removeEventListener(EVENTS.MOUSE_CLICK, mouseClick);
  element.removeEventListener(EVENTS.MOUSE_DOWN, mouseDown);
  element.removeEventListener(EVENTS.MOUSE_DOWN_ACTIVATE, mouseDownActivate);
  element.removeEventListener(EVENTS.MOUSE_DOUBLE_CLICK, mouseDoubleClick);
  element.removeEventListener(EVENTS.MOUSE_DRAG, mouseDrag);
  element.removeEventListener(EVENTS.MOUSE_MOVE, mouseMove);
  element.removeEventListener(EVENTS.MOUSE_UP, mouseUp);
  element.removeEventListener(EVENTS.MOUSE_WHEEL, mouseWheel);
  element.removeEventListener(EVENTS.MEASUREMENT_ADDED, measurementAdded);
  element.removeEventListener(EVENTS.MEASUREMENT_MODIFIED, measurementModified);
  element.removeEventListener(EVENTS.MEASUREMENT_MODIFY_COMPLETED, measurementModifyCompleted);
  element.removeEventListener(EVENTS.MEASUREMENT_REMOVED, measurementRemoved);
  element.removeEventListener(EVENTS.MEASUREMENT_COMPLETED, measurementCompleted);
  element.removeEventListener(EVENTS.MEASUREMENT_HANDLE_ACTIVE_CHANGED, measurementHandleActiveChanged);
  element.removeEventListener(EVENTS.MEASUREMENT_ACTIVE_CHANGED, measurementActiveChanged);
  element.removeEventListener(EVENTS.MEASUREMENT_SELECTED, measurementSelected);
  element.removeEventListener(EVENTS.MEASUREMENT_UNSELECTED, measurementUnselected);
};

export default {
  enable,
  disable,
};
