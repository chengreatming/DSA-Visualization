import { BaseAnnotationTool } from './base'
import EVENTS from '../events'
import triggerEvent from '../util/triggerEvent.js'
import { lengthCursor } from './cursors/index.js'
import { addToolState, removeToolState } from '../stateManagement'
import getEnabledElement from '../store/getEnabledElement'
import * as THREE from 'three'
import { v4 as uuidv4 } from 'uuid'
// import bus from '@/utils/bus';
import coordsTransform from '../util/coordsTransform'
import coordinatePicking from '../util/coordinatePicking'

const vec2Temp1 = new THREE.Vector2()
const vec2Temp2 = new THREE.Vector2()
const vec3Temp1 = new THREE.Vector3()
const vec3Temp2 = new THREE.Vector3()
const vec3Temp3 = new THREE.Vector3()
const vec3Temp4 = new THREE.Vector3()

export default class RulerTool extends BaseAnnotationTool {
  constructor(props = {}) {
    const defaultProps = {
      name: 'RulerTool',
      supportedInteractionTypes: ['Mouse', 'Touch'],
      svgCursor: lengthCursor,
      configuration: {

      }
    }
    super(props, defaultProps)
  }
  getToolHandleCoordWhenMove(eventData) {
    const intersect = coordinatePicking(eventData.enabledElement, eventData.currentPoints, { label: 'tissue' })
    let point
    if (intersect) {
      point = intersect.point
    } else {
      point = eventData.currentPoints.world
    }
    return point
  }
  createNewMeasurement(eventData) {
    const intersect = coordinatePicking(eventData.enabledElement, eventData.currentPoints, { label: 'tissue' })
    let startPoint, endPoint
    if (intersect) {
      startPoint = intersect.point
    } else {
      startPoint = eventData.currentPoints.world
    }
    startPoint.active = false
    startPoint.unmoveable = true
    endPoint = startPoint.clone()
    endPoint.active = true
    endPoint.unmoveable = true

    const textBox = Object.assign(new THREE.Vector3(), {
      active: false,
      hasMoved: false,
      allowedOutsideImage: true,
      isTextBox: true,
      hasBoundingBox: true,
      boundingBox: new THREE.Vector2()
    })

    const measurementData = {
      uuid: uuidv4(),
      unmoveable: true,
      visible: true,
      active: true,
      selected: false,
      handles: {
        start: startPoint,
        end: endPoint,
        textBox,
      },
      source: '3D'
    }

    return measurementData
  }
  onMeasurementAdded(e) {
    const eventData = e.detail
    // console.log('onMeasurementAdded', eventData.measurementData.handles)
    //bus.emit('ADD_TOOL_RULER', eventData.measurementData)
  }
  onMeasurementModified(e) {
    const eventData = e.detail
    // console.log('onMeasurementModified', eventData.measurementData.handles)
    //bus.emit('MODIFY_TOOL_RULER', eventData.measurementData)
  }
  onMeasurementHandleActiveChanged(e) {
    const eventData = e.detail
    // console.log('onMeasurementHandleActiveChanged', eventData.measurementData.handles)
    //bus.emit('MODIFY_TOOL_RULER', eventData.measurementData)
  }
  onMeasurementActiveChanged(e) {
    const eventData = e.detail
    // console.log('onMeasurementActiveChanged', eventData.measurementData.handles)
    //bus.emit('MODIFY_TOOL_RULER', eventData.measurementData)
  }
  onMeasurementRemoved(e) {
    const eventData = e.detail
    // console.log('onMeasurementRemoved', eventData.measurementData.handles)
    //bus.emit('REMOVE_TOOL_RULER', eventData.measurementData)
  }
  onMeasurementCompleted(e) {
    const eventData = e.detail
    // console.log('onMeasurementCompleted', eventData.measurementData.handles)
    eventData.measurementData.handles.start.unmoveable = false
    eventData.measurementData.handles.end.unmoveable = false
    //bus.emit('COMPLETE_TOOL_RULER', eventData.measurementData)
  }
  onMeasurementModifyCompleted(e) {
    const eventData = e.detail
    // console.log('onMeasurementModifyCompleted', eventData.measurementData.handles)
    //bus.emit('MODIFY_TOOL_RULER', eventData.measurementData)
  }
  onMeasurementSelected(e) {
    const eventData = e.detail
    //bus.emit('SELECT_TOOL_RULER', { uuid: eventData.measurementData.uuid, source: '3D' })
  }
  onMeasurementUnselected(e) {
    const eventData = e.detail
    //bus.emit('UNSELECT_TOOL_RULER', { uuid: eventData.measurementData.uuid, source: '3D' })
  }
  pointNearTool(enabledElement, data, coords, interactionType = 'mouse') {
    if (!this.currentMeasurement) {
      const distanceThreshold = data.radius || 3
      const startCanvas = coordsTransform.worldToScreen(enabledElement, data.handles.start)
      const endCanvas = coordsTransform.worldToScreen(enabledElement, data.handles.end)
      if (data.handles.start.equals(data.handles.end)) {
        return vec2Temp1.subVectors(startCanvas, coords).length() <= distanceThreshold
      } else {
        const closestPoint = new THREE.Line3(vec3Temp1.set(startCanvas.x, startCanvas.y, 0), vec3Temp2.set(endCanvas.x, endCanvas.y, 0)).closestPointToPoint(vec3Temp3.set(coords.x, coords.y, 0), true, vec3Temp4)
        return vec2Temp1.subVectors(vec2Temp2.set(closestPoint.x, closestPoint.y), coords).length() <= distanceThreshold
      }
    }
  }
  mouseMoveCallback(e, picking = true) {
    let imageNeedsUpdate = false
    if (this.currentMeasurement) {
      const eventData = e.detail
      let endPoint
      if (picking) {
        const intersect = coordinatePicking(eventData.enabledElement, eventData.currentPoints, { label: 'tissue' })
        if (intersect) {
          endPoint = intersect.point
        } else {
          endPoint = eventData.currentPoints.world
        }
      } else {
        endPoint = eventData.currentPoints.world
      }
      if (endPoint) {
        this.currentMeasurement.handles.end.copy(endPoint)
        const eventType = EVENTS.MEASUREMENT_MODIFIED;
        const modifiedEventData = {
          toolName: this.name,
          toolType: this.name,
          element: eventData.element,
          measurementData: this.currentMeasurement,
          currentPoints: eventData.currentPoints
        };
        triggerEvent(eventData.element, eventType, modifiedEventData);
        imageNeedsUpdate = true
      }
    } else {
      imageNeedsUpdate = super.mouseMoveCallback(e)
    }
    return imageNeedsUpdate
  }
  isMeasurementValid({ element, enabledElement, measurement }) {
    if (this.isOutOfBoundingBox(enabledElement.widgets.getVolumeBoundingBox(), measurement.handles)) {
      return false
    }
    if (measurement.handles.start && measurement.handles.end) {
      const length = new THREE.Vector3().subVectors(measurement.handles.start, measurement.handles.end).length()
      if (length) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
  addNewMeasurement(e) {
    e.preventDefault();
    e.stopPropagation();
    const eventData = e.detail;
    const element = eventData.element;
    const enabledElement = getEnabledElement(element);
    if (this.currentMeasurement) {
      const imageNeedsUpdate = this.mouseMoveCallback(e, true)
      if (imageNeedsUpdate) {
        this.currentMeasurement.active = false
        this.currentMeasurement.handles.start.active = false
        this.currentMeasurement.handles.end.active = false

        // textBox position
        const { start, end } = this.currentMeasurement.handles
        const textBoxPosition = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
        this.currentMeasurement.handles.textBox.copy(textBoxPosition)

        if (this.isMeasurementValid({ element, enabledElement, measurement: this.currentMeasurement })) {
          const eventType = EVENTS.MEASUREMENT_COMPLETED;
          const completeEventData = {
            toolName: this.name,
            toolType: this.name,
            element,
            measurementData: this.currentMeasurement,
            currentPoints: eventData.currentPoints
          };
          triggerEvent(element, eventType, completeEventData);
        } else {
          removeToolState(element, this.name, this.currentMeasurement)
        }
        this.currentMeasurement = null
      }
    } else {
      const measurementData = this.createNewMeasurement(eventData);
      if (!measurementData) {
        return
      }
      const currentPoints = eventData.currentPoints
      // Associate this data with this imageId so we can render it and manipulate it
      addToolState(element, this.name, measurementData, currentPoints);
      this.currentMeasurement = measurementData;
    }
    return true
  }
}