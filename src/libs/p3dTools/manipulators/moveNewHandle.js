import EVENTS from '../events.js';
// import external from '../externalModules.js';
import anyHandlesOutsideImage from './anyHandlesOutsideImage.js';
import { removeToolState } from '../stateManagement/toolState.js';
import triggerEvent from '../util/triggerEvent.js';
// import { clipToBox } from '../util/clip.js';
import { state } from './../store/index.js';
import { default as getToolForElement } from '../store/getToolForElement.js';
import BaseAnnotationTool from '../tools/base/BaseAnnotationTool';

const _moveEvents = {
  mouse: [EVENTS.MOUSE_MOVE, EVENTS.MOUSE_DRAG],
  touch: [EVENTS.TOUCH_DRAG],
};

const _moveEndEvents = {
  mouse: [EVENTS.MOUSE_UP, EVENTS.MOUSE_CLICK],
  touch: [EVENTS.TOUCH_END, EVENTS.TOUCH_PINCH, EVENTS.TAP],
};

/**
 * Move a new handle
 * @public
 * @method moveNewHandle
 * @memberof Manipulators
 *
 * @param {*} evtDetail
 * @param {*} toolName
 * @param {*} annotation
 * @param {*} handle
 * @param {*} [options={}]
 * @param {Boolean}  [options.deleteIfHandleOutsideImage]
 * @param {Boolean}  [options.preventHandleOutsideImage]
 * @param {string} [interactionType=mouse]
 * @param {function} [doneMovingCallback]
 * @returns {void}
 */
export default function (
  evtDetail,
  toolName,
  annotation,
  handle,
  options,
  interactionType = 'mouse',
  doneMovingCallback
) {
  // Use global defaults, unless overidden by provided options
  options = Object.assign(
    {
      deleteIfHandleOutsideImage: state.deleteIfHandleOutsideImage,
      preventHandleOutsideImage: state.preventHandleOutsideImage,
    },
    options
  );

  const element = evtDetail.element;

  annotation.active = true;
  handle.active = true;
  state.isToolLocked = true;

  function moveHandler(evt) {
    _moveHandler(
      toolName,
      annotation,
      handle,
      options,
      interactionType,
      {
        moveHandler,
        moveEndHandler,
      },
      evt
    );
  }
  // So we don't need to inline the entire `moveEndEventHandler` function
  function moveEndHandler(evt) {
    _moveEndHandler(
      toolName,
      annotation,
      handle,
      options,
      interactionType,
      {
        moveHandler,
        moveEndHandler,
      },
      evt,
      doneMovingCallback
    );
  }

  // Add event listeners
  _moveEvents[interactionType].forEach(eventType => {
    element.addEventListener(eventType, moveHandler);
  });
  element.addEventListener(EVENTS.TOUCH_START, _stopImmediatePropagation);
}

function _moveHandler(
  toolName,
  annotation,
  handle,
  options,
  interactionType,
  { moveEndHandler },
  evt
) {
  const { currentPoints, deltaPoints, image, element, buttons } = evt.detail;
  // Add moveEndEvent Handler when move trigger

  _moveEndEvents[interactionType].forEach(eventType => {
    element.addEventListener(eventType, moveEndHandler);
  });
  const activeTool = getToolForElement(element, toolName);

  annotation.invalidated = true;
  handle.active = true;


  if (options && options.preventHandleOutsideImage) {
    // clipToBox(handle, image);
  }

  // external.cornerstone.updateImage(element);
  if (activeTool && typeof activeTool.getToolHandleCoordWhenMove === 'function') {
    const newHandleCoord = activeTool.getToolHandleCoordWhenMove(evt.detail);
    if (newHandleCoord) {
      handle.copy(newHandleCoord);
    } else {
      handle.add(deltaPoints.world);
    }
  } else {
    handle.add(deltaPoints.world);
  }
  if (activeTool instanceof BaseAnnotationTool) {
    activeTool.updateCachedStats(image, element, annotation);
  }

  const eventType = EVENTS.MEASUREMENT_MODIFIED;
  const modifiedEventData = {
    toolName,
    toolType: toolName,
    element,
    measurementData: annotation,
  };

  triggerEvent(element, eventType, modifiedEventData);
}

function _moveEndHandler(
  toolName,
  annotation,
  handle,
  options,
  interactionType,
  { moveHandler, moveEndHandler },
  evt,
  doneMovingCallback
) {
  const { element, currentPoints, buttons, deltaPoints } = evt.detail;
  const activeTool = getToolForElement(element, toolName);
  const completedEventData = {
    toolName,
    element,
    measurementData: annotation,
  };
  // "Release" the handle
  annotation.active = false;
  annotation.invalidated = true;
  handle.active = false;
  if (activeTool && typeof activeTool.getToolHandleCoordWhenMove === 'function') {
    const newHandleCoord = activeTool.getToolHandleCoordWhenMove(evt.detail);
    if (newHandleCoord) {
      handle.copy(newHandleCoord);
    } else {
      handle.add(deltaPoints.world);
    }
  } else {
    handle.add(deltaPoints.world);
  }
  state.isToolLocked = false;

  // Remove event listeners
  _moveEvents[interactionType].forEach(eventType => {
    element.removeEventListener(eventType, moveHandler);
  });
  _moveEndEvents[interactionType].forEach(eventType => {
    element.removeEventListener(eventType, moveEndHandler);
  });
  element.removeEventListener(EVENTS.TOUCH_START, _stopImmediatePropagation);

  // TODO: WHY?
  // Why would a Touch_Pinch or Touch_Press be associated with a new handle?
  if (evt.type === EVENTS.TOUCH_PINCH || evt.type === EVENTS.TOUCH_PRESS) {
    handle.active = false;
    // external.cornerstone.updateImage(element);
    if (typeof options.doneMovingCallback === 'function') {
      console.warn(
        '`options.doneMovingCallback` has been depricated.'
      );

      options.doneMovingCallback();
    }

    if (typeof doneMovingCallback === 'function') {
      doneMovingCallback();
    }

    return;
  }

  if (options.preventHandleOutsideImage) {
    // clipToBox(handle, evt.detail.image);
  }

  // If any handle is outside the image, delete the tool data
  // if (
  //   options.deleteIfHandleOutsideImage &&
  //   anyHandlesOutsideImage(evt.detail, annotation.handles)
  // ) {
  //   removeToolState(element, toolName, annotation);
  // }

  if (typeof options.doneMovingCallback === 'function') {
    console.warn(
      '`options.doneMovingCallback` has been depricated.'
    );

    options.doneMovingCallback();
  }

  if (typeof doneMovingCallback === 'function') {
    doneMovingCallback();
  }

  // Update Image
  // external.cornerstone.updateImage(element);
}

/**
 * Stop the CornerstoneToolsTouchStart event from
 * Becoming a CornerstoneToolsTouchStartActive event when
 * MoveNewHandle ends
 *
 * @private
 * @function _stopImmediatePropagation
 *
 * @param {*} evt
 * @returns {Boolean} false
 */
function _stopImmediatePropagation(evt) {
  evt.stopImmediatePropagation();

  return false;
}
