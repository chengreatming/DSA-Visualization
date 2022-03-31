import BaseTool from './base/BaseTool.js';
import { toolColors } from '../stateManagement'
import * as THREE from 'three'
import coordinatePicking from '../util/coordinatePicking'
import coordsTransform from '../util/coordsTransform'
import isSphereOutsideBox from '../util/isSphereOutsideBox'
export default class BallTool extends BaseTool {
  constructor(props = {}) {
    const defaultProps = {
      name: 'BallTool',
      supportedInteractionTypes: ['Mouse', 'Touch'],
      svgCursor: null,
      configuration: {
        panSpeed: 1.0,
        minRadius: 5,
      }
    };
    super(props, defaultProps);
    this.handles = {
      start: null,
      end: null,
      mesh: null,
      radius: 0,
      outSideVolume: false
    }
  }

  preMouseDownActivateCallback = (e) => {
    const eventData = e.detail
    const { enabledElement, currentPoints } = eventData
    const { scene, control } = enabledElement
    const intersect = coordinatePicking(enabledElement, currentPoints)
    const minRadius = this.configuration.minRadius
    if (intersect) {
      this.handles.start = {
        world: intersect.point,
        screen: coordsTransform.worldToScreen(enabledElement, intersect.point)
      }

      const geometry = new THREE.SphereGeometry(minRadius, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: toolColors.getToolColor(),
        opacity: 0.8,
        transparent: true,
      })

      const ballMesh = new THREE.Mesh(geometry, material)
      // ballMesh.geometry.translate(this.handles.start.world.x, this.handles.start.world.y, this.handles.start.world.z)
      ballMesh.position.copy(this.handles.start.world)
      ballMesh.name = 'ball'
      this.handles.mesh = ballMesh
      scene.add(ballMesh)
      control.render()
    }
  }

  mouseDragCallback = (e) => {
    if (!this.handles.start) return false

    const eventData = e.detail
    const { enabledElement, currentPoints } = eventData
    const { control, widgets } = enabledElement
    const minRadius = this.configuration.minRadius
    let radius = new THREE.Vector2().subVectors(currentPoints.screen, this.handles.start.screen).length()
    radius = Math.max(minRadius, radius)
    const geometry = new THREE.SphereGeometry(radius, 32, 32);

    const volumeBoundingBox = widgets.getVolumeBoundingBox()
    const sphere = new THREE.Sphere(this.handles.start.world, radius)
    const outSideVolume = isSphereOutsideBox(sphere, volumeBoundingBox)

    const color = outSideVolume ? toolColors.getWarningColor() : toolColors.getToolColor()

    this.handles.mesh.material.color = color
    const { material, _transparentMaterial } = this.handles.mesh
    material.color = color
    if (_transparentMaterial) {
      _transparentMaterial.color = color
    }
    this.handles.mesh.geometry.dispose()
    this.handles.mesh.geometry = geometry

    this.handles.outSideVolume = outSideVolume
    control.render()
  }

  mouseUpCallback = (e) => {
    const eventData = e.detail
    const { enabledElement } = eventData
    const { scene, control } = enabledElement


    if (this.handles.outSideVolume) {
      scene.remove(this.handles.mesh)
      control.render()
      return
    }
    if (this.handles.start) {
      const { ballControler, navPointMouseDownCallback } = this.options
      if (ballControler) {
        const mesh = this.handles.mesh
        const onSuccess = () => {
          // if (typeof navPointMouseDownCallback === 'function') {
          //   navPointMouseDownCallback(mesh.position.clone())
          // }
          scene.remove(mesh)
          control.render()
        }
        ballControler.dispatchAddTissue(this.handles.mesh, onSuccess)
      }
    }

    this.handles = {
      start: null,
      end: null,
      mesh: null,
      radius: 0,
      outSideVolume: false
    }
  }

  mouseClickCallback(e) {
    const eventData = e.detail
    const { enabledElement } = eventData
    const { scene, control } = enabledElement

    if (this.handles.start) {
      const mesh = this.handles.mesh
      scene.remove(mesh)
      control.render()

      this.handles = {
        start: null,
        end: null,
        mesh: null,
        radius: 0,
        outSideVolume: false
      }
    }
  }
}