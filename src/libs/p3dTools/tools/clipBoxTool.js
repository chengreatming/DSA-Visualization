import BaseTool from './base/BaseTool.js';
import { toolColors } from '../stateManagement'
import coordsTransform from '../util/coordsTransform'
export default class ClipBoxTool extends BaseTool {
  constructor(props = {}) {
    const defaultProps = {
      name: 'ClipBoxTool',
      supportedInteractionTypes: ['Mouse', 'Touch'],
      svgCursor: null,
      specialSupportedCallback: ['mouseDown', 'mouseMove', 'mouseDrag'],
      configuration: {
        // panSpeed: 1.0,
      }
    };

    super(props, defaultProps);
  }

  preMouseDownCallback = (e) => {
    if (this.activeObj) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  mouseMoveCallback = (e) => {
    const eventData = e.detail
    const { enabledElement, currentPoints } = eventData
    const { planeHandlePositions, clipPlanes, planeHandles } = this.options
    const control = enabledElement.control
    const mouseScreenCoord = currentPoints.screen
    const keys = Object.keys(planeHandlePositions)
    for (let i = 0; i < 6; i++) {
      const key = keys[i]
      const worldCoord = planeHandlePositions[key]
      const screenCoord = coordsTransform.worldToScreen(enabledElement, worldCoord)
      const distance = mouseScreenCoord.distanceTo(screenCoord)
      if (distance < 6) {
        const handle = planeHandles[key]
        const plane = clipPlanes[key]
        this.activeObj = { handle, plane, key }
        console.log(key, this.activeHandle, this.activePlane)
        handle.material.color = toolColors.getActiveColor()
        control && control.render()
        return
      }
    }

    if (this.activeObj) {
      this.activeObj.handle.material.color = toolColors.getToolColor()
      control && control.render()
    }
    this.activeObj = null
  }

  mouseDragCallback = (e) => {
    if (!this.activeObj) return false
    const eventData = e.detail
    const { key } = this.activeObj
    const { updateClipPlane, planeHandlePositions, volume } = this.options
    const worldDelta = eventData.deltaPoints.world
    const position = planeHandlePositions[key].clone()
    position.add(worldDelta).clamp(volume.boundingBox.min, volume.boundingBox.max)
    let constant
    switch (true) {
      case 'lr'.includes(key):
        constant = position.x
        break;
      case 'ap'.includes(key):
        constant = position.y
        break;
      case 'is'.includes(key):
        constant = position.z
        break;
      default:
        break;
    }
    if (typeof updateClipPlane === 'function') {
      updateClipPlane(key, constant)
    }
  }
}