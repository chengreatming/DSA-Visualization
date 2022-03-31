import BaseTool from './base/BaseTool.js';
import { panCursor } from './cursors/index.js';
import * as THREE from 'three'
export default class PanTool extends BaseTool {
  constructor(props = {}) {
    const defaultProps = {
      name: 'PanTool',
      supportedInteractionTypes: ['Mouse', 'Touch'],
      svgCursor: panCursor,
      configuration: {
        panSpeed: 1.0,
      }
    };

    super(props, defaultProps);
  }
  mouseDragCallback = (e) => {
    const eventData = e.detail
    const { camera, offset } = eventData.enabledElement
    const cameraDelta = eventData.deltaPoints.camera
    const end = new THREE.Vector3().set(0, 0, 0).applyMatrix4(camera.matrixWorld)
    const start = cameraDelta.clone().applyMatrix4(camera.matrixWorld)
    const translation = offset.subVectors(end, start)
    camera.position.add(translation)
    camera.updateProjectionMatrix()
    return true
  }
}