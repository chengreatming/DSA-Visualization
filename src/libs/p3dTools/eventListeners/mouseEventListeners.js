import EVENTS from '../events.js';
import triggerEvent from '../util/triggerEvent.js';
import coordsTransform from '../util/coordsTransform'
import copyPoints from '../util/copyPoints'
import getEnabledElement from '../store/getEnabledElement'
import * as THREE from 'three'

let isClickEvent = true;
let preventClickTimeout;
const clickDelay = 200;
let lastPoints = {
  ndc: new THREE.Vector2(),
  world: new THREE.Vector3(),
  camera: new THREE.Vector3(),
  screen: new THREE.Vector2(),
  page: new THREE.Vector2(),
};

function getEventButtons(event) {
  if (typeof event.buttons === 'number') {
    return event.buttons;
  }

  switch (event.which) {
    // No button
    case 0:
      return 0;
    // Left
    case 1:
      return 1;
    // Middle
    case 2:
      return 4;
    // Right
    case 3:
      return 2;
    default:
  }

  return 0;
}

function preventClickHandler() {
  isClickEvent = false;
}

function mouseDoubleClick(e) {
  const element = e.currentTarget;
  const eventType = EVENTS.MOUSE_DOUBLE_CLICK;
  const enabledElement = getEnabledElement(element)

  if (!enabledElement || !enabledElement.scene) return false
  const page = new THREE.Vector2(e.pageX, e.pageY),
    screen = coordsTransform.pageToScreen(enabledElement, page)
  const startPoints = {
    ndc: coordsTransform.screenToNdc(enabledElement, screen),
    world: coordsTransform.screenToWorld(enabledElement, screen),
    camera: coordsTransform.screenToCamera(enabledElement, screen),
    screen: screen,
    page: new THREE.Vector2(e.pageX, e.pageY)
  };

  const deltaPoints = {
    ndc: startPoints.ndc.clone().sub(lastPoints.ndc),
    world: startPoints.world.clone().sub(lastPoints.world),
    camera: startPoints.camera.clone().sub(lastPoints.camera),
    screen: startPoints.screen.clone().sub(lastPoints.screen),
    page: startPoints.page.clone().sub(lastPoints.page),
  };

  const eventData = {
    event: e,
    buttons: getEventButtons(e),
    element,
    enabledElement,
    startPoints,
    lastPoints,
    currentPoints: startPoints,
    deltaPoints,
    type: eventType,
  };

  lastPoints = copyPoints(startPoints);

  triggerEvent(element, eventType, eventData);
}

function mouseDown(e) {
  const element = e.currentTarget;
  const enabledElement = getEnabledElement(element)
  if (!enabledElement || !enabledElement.scene) return false

  preventClickTimeout = setTimeout(preventClickHandler, clickDelay);

  // Prevent CornerstoneToolsMouseMove while mouse is down
  element.removeEventListener('mousemove', mouseMove);
  const page = new THREE.Vector2(e.pageX, e.pageY),
    screen = coordsTransform.pageToScreen(enabledElement, page)
  const startPoints = {
    page,
    screen,
    ndc: coordsTransform.screenToNdc(enabledElement, screen),
    world: coordsTransform.screenToWorld(enabledElement, screen),
    camera: coordsTransform.screenToCamera(enabledElement, screen),
  };
  // console.log('ndc---startPoints', startPoints.ndc)
  // console.log('world---startPoints', startPoints.world)
  // console.log('camera', startPoints.camera)
  // console.log('world', startPoints.world)
  // console.log('screen', startPoints.screen)
  lastPoints = copyPoints(startPoints);

  const deltaPoints = {
    ndc: startPoints.ndc.clone().sub(lastPoints.ndc),
    world: startPoints.world.clone().sub(lastPoints.world),
    camera: startPoints.camera.clone().sub(lastPoints.camera),
    screen: startPoints.screen.clone().sub(lastPoints.screen),
    page: startPoints.page.clone().sub(lastPoints.page),
  };

  const eventData = {
    event: e,
    buttons: getEventButtons(e),
    element,
    enabledElement,
    startPoints,
    lastPoints,
    currentPoints: startPoints,
    deltaPoints,
    type: EVENTS.MOUSE_DOWN,
  };

  const eventPropagated = triggerEvent(
    eventData.element,
    EVENTS.MOUSE_DOWN,
    eventData
  );

  if (eventPropagated) {
    // No tools responded to this event, create a new tool
    eventData.type = EVENTS.MOUSE_DOWN_ACTIVATE;
    triggerEvent(eventData.element, EVENTS.MOUSE_DOWN_ACTIVATE, eventData);
  }

  function mouseDrag(e) {
    // Calculate our current points in page and image coordinates
    const eventType = EVENTS.MOUSE_DRAG;
    const enabledElement = getEnabledElement(element)

    if (!enabledElement || !enabledElement.scene) return false
    const page = new THREE.Vector2(e.pageX, e.pageY),
      screen = coordsTransform.pageToScreen(enabledElement, page)
    const currentPoints = {
      page,
      screen,
      ndc: coordsTransform.screenToNdc(enabledElement, screen),
      world: coordsTransform.screenToWorld(enabledElement, screen),
      camera: coordsTransform.screenToCamera(enabledElement, screen),
    };
    // Calculate delta values in page and image coordinates
    const deltaPoints = {
      ndc: currentPoints.ndc.clone().sub(lastPoints.ndc),
      world: currentPoints.world.clone().sub(lastPoints.world),
      camera: currentPoints.camera.clone().sub(lastPoints.camera),
      screen: currentPoints.screen.clone().sub(lastPoints.screen),
      page: currentPoints.page.clone().sub(lastPoints.page),
    };
    // console.log('x:', deltaPoints.screen.x, 'y:', deltaPoints.screen.y)
    const eventData = {
      buttons: getEventButtons(e),
      element,
      enabledElement,
      startPoints,
      lastPoints,
      currentPoints,
      deltaPoints,
      type: eventType,
      ctrlKey: e.ctrlKey,
      metaKey: e.metaKey,
      shiftKey: e.shiftKey,
    };

    triggerEvent(eventData.element, eventType, eventData);

    // Update the last points
    lastPoints = copyPoints(currentPoints);
  }

  // Hook mouseup so we can unbind our event listeners
  // When they stop dragging
  function onMouseUp(e) {
    // Cancel the timeout preventing the click event from triggering
    clearTimeout(preventClickTimeout);
    let eventType = EVENTS.MOUSE_UP;


    if (isClickEvent) {
      eventType = EVENTS.MOUSE_CLICK;
    }

    // Calculate our current points in page and image coordinates
    const enabledElement = getEnabledElement(element)

    if (!enabledElement || !enabledElement.camera) return false

    const page = new THREE.Vector2(e.pageX, e.pageY),
      screen = coordsTransform.pageToScreen(enabledElement, page)
    const currentPoints = {
      page,
      screen,
      ndc: coordsTransform.screenToNdc(enabledElement, screen),
      world: coordsTransform.screenToWorld(enabledElement, screen),
      camera: coordsTransform.screenToCamera(enabledElement, screen),
    };

    // Calculate delta values in page and image coordinates
    const deltaPoints = {
      ndc: currentPoints.ndc.clone().sub(lastPoints.ndc),
      world: currentPoints.world.clone().sub(lastPoints.world),
      camera: currentPoints.camera.clone().sub(lastPoints.camera),
      screen: currentPoints.screen.clone().sub(lastPoints.screen),
      page: currentPoints.page.clone().sub(lastPoints.page),
    };

    const eventData = {
      event: e,
      buttons: getEventButtons(e),
      element,
      enabledElement,
      startPoints,
      lastPoints,
      currentPoints,
      deltaPoints,
      type: eventType,
    };

    triggerEvent(eventData.element, eventType, eventData);
    document.removeEventListener('mousemove', mouseDrag);
    document.removeEventListener('mouseup', onMouseUp);

    element.addEventListener('mousemove', mouseMove);

    isClickEvent = true;
  }

  document.addEventListener('mousemove', mouseDrag);
  document.addEventListener('mouseup', onMouseUp);
}

function mouseMove(e) {
  const element = e.currentTarget;
  const enabledElement = getEnabledElement(element)
  if (!enabledElement || !enabledElement.camera) return false

  const eventType = EVENTS.MOUSE_MOVE;

  const page = new THREE.Vector2(e.pageX, e.pageY),
    screen = coordsTransform.pageToScreen(enabledElement, page)
  const startPoints = {
    page,
    screen,
    ndc: coordsTransform.screenToNdc(enabledElement, screen),
    world: coordsTransform.screenToWorld(enabledElement, screen),
    camera: coordsTransform.screenToCamera(enabledElement, screen),
  };

  // Calculate our current points in page and image coordinates
  const currentPoints = copyPoints(startPoints);

  // Calculate delta values in page and image coordinates
  const deltaPoints = {
    ndc: currentPoints.ndc.clone().sub(lastPoints.ndc),
    world: currentPoints.world.clone().sub(lastPoints.world),
    camera: currentPoints.camera.clone().sub(lastPoints.camera),
    screen: currentPoints.screen.clone().sub(lastPoints.screen),
    page: currentPoints.page.clone().sub(lastPoints.page),
  };

  const eventData = {
    element,
    enabledElement,
    startPoints,
    lastPoints,
    currentPoints,
    deltaPoints,
    type: eventType,
  };

  triggerEvent(element, eventType, eventData);

  // Update the last points
  lastPoints = copyPoints(currentPoints);
}

function disable(element) {
  element.removeEventListener('mousedown', mouseDown);
  element.removeEventListener('mousemove', mouseMove);
  element.removeEventListener('dblclick', mouseDoubleClick);
}

function enable(element) {
  // Prevent handlers from being attached multiple times
  disable(element);

  element.addEventListener('mousedown', mouseDown);
  element.addEventListener('mousemove', mouseMove);
  element.addEventListener('dblclick', mouseDoubleClick);
}

export default {
  enable,
  disable,
};
