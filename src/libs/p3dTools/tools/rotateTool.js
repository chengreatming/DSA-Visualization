import BaseTool from './base/BaseTool.js';
import { rotateCursor } from './cursors/index.js';
import * as THREE from 'three'
export default class RotateTool extends BaseTool {
  constructor(props = {}) {
    const defaultProps = {
      name: 'RotateTool',
      supportedInteractionTypes: ['Mouse', 'Touch'],
      svgCursor: rotateCursor,
      configuration: {
        rotateSpeed: 3,
      }
    };

    super(props, defaultProps);
  }
  mouseDragCallback = (e) => {
    const eventData = e.detail
    const { domElement, camera, offset, target } = eventData.enabledElement
    const screenDelta = eventData.deltaPoints.screen
    const x = screenDelta.x / domElement.clientWidth * this.configuration.rotateSpeed
    const y = screenDelta.y / domElement.clientHeight * this.configuration.rotateSpeed
    const worldDirection = camera.getWorldDirection(new THREE.Vector3())
    const angle = Math.sqrt(x * x + y * y) * 2 * Math.PI
    const mouseStartVec3 = new THREE.Vector3().set(0, 0, 0).unproject(camera)
    const mouseEndVec3 = new THREE.Vector3().set(x, -y, 0).unproject(camera)
    const rotateAxis = new THREE.Vector3().crossVectors(worldDirection, mouseEndVec3.sub(mouseStartVec3).normalize())

    camera.rotateOnWorldAxis(rotateAxis, angle)
    offset.subVectors(camera.position, target)
    offset.applyAxisAngle(rotateAxis, angle)
    camera.position.copy(target).add(offset)
    camera.updateProjectionMatrix()
    camera.dispatchEvent({ type: 'rotate', rotateAxis: rotateAxis, angle })
    return true
  }
}