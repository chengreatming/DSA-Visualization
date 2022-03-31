import BaseTool from './BaseTool.js';
import { getToolState } from './../../stateManagement/toolState.js';
import handleActivator from './../../manipulators/handleActivator.js';
import { selecteToolState, removeToolState } from '../../stateManagement'
import getEnabledElement from '../../store/getEnabledElement'
import {
  moveHandleNearImagePoint,
  moveAnnotation,
} from './../../util/findAndMoveHelpers.js';
import EVENTS from './../../events.js';
import triggerEvent from './../../util/triggerEvent.js';
/**
 * @memberof Tools.Base
 * @classdesc Abstract class for tools which create and display annotations on the
 * cornerstone canvas.
 * @extends Tools.Base.BaseTool
 */
class BaseAnnotationTool extends BaseTool {
  // ===================================================================
  // Abstract Methods - Must be implemented.
  // ===================================================================

  /**
   * Creates a new annotation.
   *
   * @method createNewMeasurement
   * @memberof Tools.Base.BaseAnnotationTool
   *
   * @param  {type} evt description
   * @returns {type}     description
   */
  // eslint-disable-next-line no-unused-vars
  createNewMeasurement(evt) {
    throw new Error(
      `Method createNewMeasurement not implemented for ${this.name}.`
    );
  }

  /**
   *
   * Returns true if the given coords are need the tool.
   *
   * @method pointNearTool
   * @memberof Tools.Base.BaseAnnotationTool
   *
   * @param {*} element
   * @param {*} data
   * @param {*} coords
   * @param {string} [interactionType=mouse]
   * @returns {boolean} If the point is near the tool
   */
  // eslint-disable-next-line no-unused-vars
  pointNearTool(element, data, coords, interactionType = 'mouse') {
    throw new Error(`Method pointNearTool not implemented for ${this.name}.`);
  }

  /**
   * Returns the distance in px from the given coords to the closest handle of the annotation.
   *
   * @method distanceFromPoint
   * @memberof Tools.Base.BaseAnnotationTool
   *
   * @param {*} element
   * @param {*} data
   * @param {*} coords
   * @returns {number} -  the distance in px from the provided coordinates to the
   * closest rendered portion of the annotation. -1 if the distance cannot be
   * calculated.
   */
  // eslint-disable-next-line no-unused-vars
  distanceFromPoint(element, data, coords) {
    throw new Error(
      `Method distanceFromPoint not implemented for ${this.name}.`
    );
  }

  /**
   * Used to redraw the tool's annotation data per render
   *
   * @abstract
   * @param {*} evt
   * @returns {void}
   */
  // eslint-disable-next-line no-unused-vars
  renderToolData(evt) {
    throw new Error(`renderToolData not implemented for ${this.name}.`);
  }

  hightLightToolData() {
    return false
  }
  // ===================================================================
  // Virtual Methods - Have default behavior but may be overriden.
  // ===================================================================

  /**
   * Event handler for MOUSE_MOVE event.
   *
   * @abstract
   * @event
   * @param {Object} evt - The event.
   * @returns {boolean} - True if the image needs to be updated
   */
  mouseMoveCallback(evt) {
    const { element, currentPoints, enabledElement } = evt.detail;
    const coords = currentPoints.screen;
    const toolState = getToolState(element, this.name);

    let imageNeedsUpdate = false;
    for (let d = 0; d < toolState.data.length; d++) {
      const data = toolState.data[d];
      const distanceThreshold = data.radius
      // // Hovering a handle?
      if (handleActivator(enabledElement, data.handles, coords, distanceThreshold) === true) {
        triggerEvent(element, EVENTS.MEASUREMENT_HANDLE_ACTIVE_CHANGED, { toolName: this.name, toolType: this.name, element, measurementData: data });
        imageNeedsUpdate = true;
      }

      // // Tool data's 'active' does not match coordinates
      // // TODO: can't we just do an if/else and save on a pointNearTool check?
      const pointNearTool = this.pointNearTool(enabledElement, data, coords, 'mouse')
      const nearToolAndNotMarkedActive = pointNearTool && !data.active;
      const notNearToolAndMarkedActive = !pointNearTool && data.active;

      if (nearToolAndNotMarkedActive || notNearToolAndMarkedActive) {
        data.active = !data.active;
        const needRenderHightLight = this.hightLightToolData(data)
        triggerEvent(element, EVENTS.MEASUREMENT_ACTIVE_CHANGED, { toolName: this.name, toolType: this.name, element, measurementData: data });
        if (needRenderHightLight) {
          imageNeedsUpdate = true
        }
      }
    }

    return imageNeedsUpdate;
  }
  isOutOfBoundingBox(boundingBox, handles) {
    for (let key in handles) {
      const handle = handles[key]
      if (handle.allowedOutsideImage !== true && !boundingBox.containsPoint(handle)) {
        return true
      }
    }
    return false
  }

  handleDoneMove(element, measurementData) {
    const enabledElement = getEnabledElement(element);
    if (this.isOutOfBoundingBox(enabledElement.widgets.getVolumeBoundingBox(), measurementData.handles)) {
      removeToolState(element, this.name, measurementData)
    } else {
      const eventData = {
        toolType: this.name,
        toolName: this.name,
        measurementData,
        element
      };
      triggerEvent(element, EVENTS.MEASUREMENT_MODIFY_COMPLETED, eventData);
    }
  }
  /**
   * Custom callback for when a handle is selected.
   * @method handleSelectedCallback
   * @memberof Tools.Base.BaseAnnotationTool
   *
   * @param  {*} evt    -
   * @param  {*} toolData   -
   * @param  {*} handle - The selected handle.
   * @param  {String} interactionType -
   * @returns {void}
   */
  handleSelectedCallback(evt, toolData, handle, interactionType = 'mouse') {
    selecteToolState(evt.detail.element, toolData);
    moveHandleNearImagePoint(evt, this, toolData, handle, interactionType, () => {
      this.handleDoneMove(evt.detail.element, toolData)
    });
  }
  /**
   * Custom callback for when a tool is selected.
   *
   * @method toolSelectedCallback
   * @memberof Tools.Base.BaseAnnotationTool
   *
   * @param  {*} evt
   * @param  {*} annotation
   * @param  {string} [interactionType=mouse]
   * @returns {void}
   */
  toolSelectedCallback(evt, annotation, interactionType = 'mouse') {
    selecteToolState(evt.detail.element, annotation);
    if (annotation.unmoveable === true) {
      evt.preventDefault();
      evt.stopPropagation();
      return false
    }
    moveAnnotation(evt, this, annotation, interactionType, () => {
      this.handleDoneMove(evt.detail.element, annotation)
    });
  }

  /**
   * Updates cached statistics for the tool's annotation data on the element
   *
   * @param {*} image
   * @param {*} element
   * @param {*} data
   * @returns {void}
   */
  updateCachedStats(image, element, data) {
    // eslint-disable-line
    // console.warn(`updateCachedStats not implemented for ${this.name}.`);
  }
}

export default BaseAnnotationTool;
