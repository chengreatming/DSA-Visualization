import EVENTS from '../events.js';
// import external from '../externalModules.js';
import anyHandlesOutsideImage from './anyHandlesOutsideImage.js';
import { removeToolState } from '../stateManagement/toolState.js';
import triggerEvent from '../util/triggerEvent.js';
// import { clipToBox } from '../util/clip.js';
import { state } from './../store/index.js';
import { default as getToolForElement } from '../store/getToolForElement.js';
import getActiveTool from '../util/getActiveTool';
import BaseAnnotationTool from '../tools/base/BaseAnnotationTool';
import coordsTransform from '../util/coordsTransform'
const runAnimation = {
  value: false,
};

const _dragEvents = {
  mouse: [EVENTS.MOUSE_DRAG],
  touch: [EVENTS.TOUCH_DRAG],
};

const _upOrEndEvents = {
  mouse: [EVENTS.MOUSE_UP, EVENTS.MOUSE_CLICK],
  touch: [
    EVENTS.TOUCH_END,
    EVENTS.TOUCH_DRAG_END,
    EVENTS.TOUCH_PINCH,
    EVENTS.TOUCH_PRESS,
    EVENTS.TAP,
  ],
};

/**
 * Move the provided handle
 *
 * @public
 * @method moveHandle
 * @memberof Manipulators
 *
 * @param {*} evtDetail
 * @param {*} toolName
 * @param {*} annotation
 * @param {*} handle
 * @param {*} [options={}]
 * @param {Boolean}  [options.deleteIfHandleOutsideImage]
 * @param {Boolean}  [options.preventHandleOutsideImage]
 * @param {*} [interactionType=mouse]
 * @param {function} doneMovingCallback
 * @returns {undefined}
 */
export default function (
  evtDetail,
  toolName,
  annotation,
  handle,
  options = {},
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
  const dragHandler = _dragHandler.bind(
    this,
    toolName,
    annotation,
    handle,
    options,
    interactionType
  );
  // So we don't need to inline the entire `upOrEndHandler` function
  const upOrEndHandler = evt => {
    _upOrEndHandler(
      toolName,
      evtDetail,
      annotation,
      handle,
      options,
      interactionType,
      {
        dragHandler,
        upOrEndHandler,
      },
      evt,
      doneMovingCallback
    );
  };

  handle.active = true;
  annotation.active = true;
  state.isToolLocked = true;

  // Add Event Listeners
  _dragEvents[interactionType].forEach(eventType => {
    element.addEventListener(eventType, dragHandler);
  });
  _upOrEndEvents[interactionType].forEach(eventType => {
    element.addEventListener(eventType, upOrEndHandler);
  });

  // ==========================
  // ========  TOUCH ==========
  // ==========================
  if (interactionType === 'touch') {
    runAnimation.value = true;
    const enabledElement = external.cornerstone.getEnabledElement(element);

    // Average pixel width of index finger is 45-57 pixels
    // https://www.smashingmagazine.com/2012/02/finger-friendly-design-ideal-mobile-touchscreen-target-sizes/
    const fingerDistance = -57;

    const aboveFinger = {
      x: evtDetail.currentPoints.page.x,
      y: evtDetail.currentPoints.page.y + fingerDistance,
    };

    const targetLocation = external.cornerstone.pageToPixel(
      element,
      aboveFinger.x,
      aboveFinger.y
    );

    _animate(handle, runAnimation, enabledElement, targetLocation);
  }
}

function _dragHandler(
  toolName,
  annotation,
  handle,
  options,
  interactionType,
  evt
) {
  const { image, deltaPoints, element, buttons, enabledElement } = evt.detail;

  // enabledElement.control && enabledElement.control.render()
  const activeTool = getActiveTool(element, buttons, interactionType);

  if (activeTool && activeTool.moveHandle) {
    // 工具私有的坐标拾取策略
    const isHandleMoved = activeTool.moveHandle(evt.detail, handle)

    if (!isHandleMoved) return false
  } else {
    if (activeTool && typeof activeTool.getToolHandleCoordWhenMove === 'function') {
      const newHandleCoord = activeTool.getToolHandleCoordWhenMove(evt.detail);
      if (newHandleCoord) {
        handle.copy(newHandleCoord);
      } else {
        handle.add(deltaPoints.world);
      }
    } else {
      handle.add(deltaPoints.world)
    }
  }

  runAnimation.value = false;
  handle.active = true;

  if (handle.hasMoved === false) {
    handle.hasMoved = true;
  }
  // TODO: A way to not flip this for textboxes on annotations
  annotation.invalidated = true;

  if (options.preventHandleOutsideImage) {
    // clipToBox(handle, image);
  }

  if (activeTool instanceof BaseAnnotationTool) {
    activeTool.updateCachedStats(image, enabledElement, annotation);
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

function _upOrEndHandler(
  toolName,
  evtDetail,
  annotation,
  handle,
  options = {},
  interactionType,
  { dragHandler, upOrEndHandler },
  evt,
  doneMovingCallback
) {
  const { element, currentPoints, buttons, deltaPoints } = evt.detail;
  const activeTool = getToolForElement(element, toolName);
  const image = evtDetail.currentPoints.image;

  handle.active = false;
  annotation.active = false;
  // TODO: A way to not flip this for textboxes on annotations
  annotation.invalidated = true;

  if (activeTool && activeTool.moveHandle) {
    // 工具私有的坐标拾取策略
    activeTool.moveHandle(evt.detail, handle)
  } else {
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
  }

  state.isToolLocked = false;
  runAnimation.value = false;

  // Remove Event Listeners
  _dragEvents[interactionType].forEach(eventType => {
    element.removeEventListener(eventType, dragHandler);
  });
  _upOrEndEvents[interactionType].forEach(eventType => {
    element.removeEventListener(eventType, upOrEndHandler);
  });

  // If any handle is outside the image, delete the tool data
  // if (
  // options.deleteIfHandleOutsideImage &&
  // anyHandlesOutsideImage(evtDetail, annotation.handles)
  // ) {
  // removeToolState(element, toolName, annotation);
  // }

  // TODO: What dark magic makes us want to handle TOUCH_PRESS differently?
  if (evt.type === EVENTS.TOUCH_PRESS) {
    evt.detail.handlePressed = annotation;
    handle.x = image.x; // Original Event
    handle.y = image.y;
  }

  if (typeof options.doneMovingCallback === 'function') {
    console.warn(
      '`options.doneMovingCallback` has been depricated.'
    );

    options.doneMovingCallback();
  }

  if (typeof doneMovingCallback === 'function') {
    doneMovingCallback();
  }
}

/**
 * Animates the provided handle using `requestAnimationFrame`
 * @private
 * @method _animate
 *
 * @param {*} handle
 * @param {*} runAnimation
 * @param {*} enabledElement
 * @param {*} targetLocation
 * @returns {undefined}
 */
function _animate(handle, runAnimation, enabledElement, targetLocation) {
  if (!runAnimation.value) {
    return;
  }

  // Pixels / second
  const distanceRemaining = Math.abs(handle.y - targetLocation.y);
  const linearDistEachFrame = distanceRemaining / 10;

  if (distanceRemaining < 1) {
    handle.y = targetLocation.y;
    runAnimation.value = false;

    return;
  }

  if (handle.y > targetLocation.y) {
    handle.y -= linearDistEachFrame;
  } else if (handle.y < targetLocation.y) {
    handle.y += linearDistEachFrame;
  }

  // Update the image
  external.cornerstone.updateImage(enabledElement.element);

  // Request a new frame
  external.cornerstone.requestAnimationFrame(function () {
    _animate(handle, runAnimation, enabledElement, targetLocation);
  });
}
