import { BaseAnnotationTool } from '../base'
import EVENTS from '../../events';
import { toolColors, selecteToolState, getToolState } from '../../stateManagement'
import handleActivator from '../../manipulators/handleActivator.js';
import coordsTransform from '../../util/coordsTransform'
import * as THREE from 'three'
import makeTextSprite from '../../util/makeTextSprite'
import getHandleNearImagePoint from '../../manipulators/getHandleNearImagePoint'
import coordinatePicking from '../../util/coordinatePicking'

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
const textActiveColor = { r: 173, g: 255, b: 47, a: 1.0 }
const textDefaultColor = { r: 255, g: 255, b: 255, a: 1.0 }
const intersectOpts = {
  intersectClipBox: false,
  intersectBoundingBox: false,
  intersectMpr: false,
}
/**
 * @public
 * @class TextMarkerTool
 * @memberof Tools.Annotation
 *
 * @classdesc Tool for annotating an image with text markers.
 * @extends Tools.Base.BaseAnnotationTool
 */
export default class TextMarkerTool extends BaseAnnotationTool {
  constructor(props = {}) {
    const defaultProps = {
      name: 'TextMarkerTool',
      supportedInteractionTypes: ['Mouse', 'Touch'],
      configuration: {
        markers: [],
        current: 1,
        radius: 3,
      },
      svgCursor: null,
    };

    super(props, defaultProps);
  }

  createNewMeasurement(eventData) {
    const config = this.configuration;
    // Create the measurement data for this tool with the end handle activated
    const { enabledElement, startPoints } = eventData

    if (!startPoints || !enabledElement) return false

    const { control } = enabledElement
    const radius = config.radius
    const intersect = coordinatePicking(enabledElement, startPoints, intersectOpts)
    // 判断是否在剪辑框中
    if (intersect) {
      const point = intersect.point
      // 绘制圆球
      const sphere = this.drawSphere(intersect.object, point)
      // 创建文字标签
      // const text = this.drawText(`text${config.current}`, sphere, sphere)
      // text.sphereUuid = sphere.uuid
      control.render()

      const measurementData = {
        id: null,
        uuid: sphere.uuid,
        tissueName: intersect.object.name,
        fkTissueId: intersect.object.fkId,
        visible: true,
        active: true,
        selected: true,
        radius,
        handles: {
          end: Object.assign(point, {
            active: true,
          }),
        },
      };
      config.current++
      if (this.options.openPrompt) {
        this.options.openPrompt(measurementData, startPoints.screen)
      }
      return measurementData;
    }

    return null
  }

  mouseMoveCallback(evt) {
    const { element, currentPoints, enabledElement } = evt.detail;
    const coords = currentPoints.screen;
    const toolState = getToolState(element, this.name);
    const { scene, camera } = enabledElement

    let imageNeedsUpdate = false;
    for (let d = 0; d < toolState.data.length; d++) {
      const data = toolState.data[d];
      const distanceThreshold = data.radius
      // // Hovering a handle?
      if (handleActivator(enabledElement, data.handles, coords, distanceThreshold) === true) {
        // 鼠标靠近标注球体
        if (data.visible === false || data.fired) {
          continue
        }
        const sphere = scene.getObjectByProperty('uuid', data.uuid)
        if (!sphere) continue

        if (data.handles && data.handles.end) {
          const active = data.handles.end.active
          let color
          // if (!data.selected) {
          if (active) {
            const raycaster = new THREE.Raycaster()
            raycaster.setFromCamera(coordsTransform.worldToNdc(enabledElement, sphere.position), camera);
            const intersects = raycaster.intersectObjects([...scene.children.filter(o => o.visible), sphere]);
            // console.log('intersects', intersects, intersects && intersects[0] && intersects[0].object !== sphere);

            if (intersects && intersects[0] && intersects[0].object !== sphere) {
              // 球体被遮挡
              color = toolColors.getToolColor()
            } else {
              color = toolColors.getActiveColor()
              const group = this.options.group
              if (group) {
                // 将球体显示在最上层
                const i = group.children.indexOf(sphere)
                group.children.splice(i, 1);
                group.children.unshift(sphere)
              }
              // 显示文字
              if (sphere.children[0]) sphere.children[0].visible = true
            }

            // color = toolColors.getActiveColor()
            // const group = this.options.group
            // if (group) {
            //   // 将球体显示在最上层
            //   const i = group.children.indexOf(sphere)
            //   group.children.splice(i, 1);
            //   group.children.unshift(sphere)
            // }
            // // 显示文字
            // if (sphere.children[0]) sphere.children[0].visible = true
          } else if (data.outSide) {
            // 球体红色
            color = toolColors.getDeactiveColor()
            // 隐藏文字
            if (sphere.children[0]) sphere.children[0].visible = false
          } else {
            // 球体橙色
            color = toolColors.getToolColor()
            // 隐藏文字
            if (sphere.children[0]) sphere.children[0].visible = false
          }
          sphere.material.color = color
          if (sphere.children[0]) {
            sphere.children[0].material.color = color
          }
          // }
        }
        imageNeedsUpdate = true;
      }
    }

    return imageNeedsUpdate;
  }

  pointNearTool() {
    return false
  }
  dragHandler = (e) => {
    if (!this.selectedData) return false
    const eventData = e.detail
    const pass = Array.isArray(this.options.mouseButtonMask) &&
      this.options.mouseButtonMask.includes(eventData.buttons)
    if (!pass) return
    const { enabledElement, deltaPoints, currentPoints } = eventData
    const { scene, control, camera } = enabledElement
    const sphere = scene.getObjectByProperty('uuid', this.selectedData.uuid)
    // const textSprite = scene.getObjectByProperty('sphereUuid', sphere.uuid)
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(currentPoints.ndc, camera);
    const visibleObjects = []
    scene.traverseVisible((o) => {
      if (o.isMesh && o.name !== this.name) {
        visibleObjects.push(o)
      }
    })
    const intersects = raycaster.intersectObjects(visibleObjects);
    if (intersects && intersects.length > 0) {
      sphere.material.color = toolColors.getActiveColor()
      if (sphere.children[0]) {
        sphere.children[0].material.color = sphere.material.color
      }
      const oldObject = scene.getObjectByProperty('fkId', this.selectedData.fkTissueId)
      const point = intersects[0].point
      const newObject = intersects[0].object
      if (oldObject !== newObject) {
        if (this.options.group) {

        } else {
          oldObject.remove(sphere)
          newObject.add(sphere)
          this.selectedData.tissueUuid = newObject.uuid
        }
      }
      this.selectedData.handles.end.copy(point)
      sphere && sphere.position.copy(point)
      // textSprite && textSprite.position.copy(point)
      if (this.selectedData.outSide) {
        this.selectedData.outSide = false
      }
    } else {
      sphere.material.color = toolColors.getDeactiveColor()
      if (sphere.children[0]) {
        sphere.children[0].material.color = sphere.material.color
      }
      sphere.position.add(deltaPoints.world)
      // textSprite.position.add(deltaPoints.world)
      this.selectedData.handles.end.copy(sphere.position)
      this.selectedData.outSide = true
      this.selectedData.needUpdate = true
    }

    control.render()
  }

  upOrEndHandler = (e) => {
    // Remove Event Listeners
    const element = e.detail.element
    const interactionType = this.interactionType
    const data = this.selectedData
    if (this.options.updateCoord) {
      this.options.updateCoord(data)
    }
    _dragEvents[interactionType].forEach(eventType => {
      element.removeEventListener(eventType, this.dragHandler);
    });
    _upOrEndEvents[interactionType].forEach(eventType => {
      element.removeEventListener(eventType, this.upOrEndHandler);
    });
    this.selectedData = null
  }

  handleSelectedCallback = (evt, toolData, handle, interactionType) => {
    const eventData = evt.detail
    const { element, enabledElement } = eventData
    const { control, scene } = enabledElement
    if (enabledElement) {
      selecteToolState(element, toolData)
      const toolState = getToolState(element, this.name);
      for (let d = 0; d < toolState.data.length; d++) {
        const data = toolState.data[d];
        if (data.selected) {
          const sphere = scene.getObjectByProperty('uuid', data.uuid)
          const color = toolColors.getActiveColor()
          sphere.material.color = color
          control && control.render()
          this.selectedData = data
          break
        }
      }
    }

    this.selectedData = toolData
    // Add Event Listeners
    this.interactionType = interactionType
    _dragEvents[interactionType].forEach(eventType => {
      element.addEventListener(eventType, this.dragHandler);
    });
    _upOrEndEvents[interactionType].forEach(eventType => {
      element.addEventListener(eventType, this.upOrEndHandler);
    });

    evt.stopImmediatePropagation();
    evt.stopPropagation();
    evt.preventDefault();
  }

  updateCachedStats(enabledElement, data) {
    // console.log('updateCachedStats', data)
    // this.draw(enabledElement)
    // Implementing to satisfy BaseAnnotationTool
  }

  drawText = (text, intersectObject) => {
    // 创建文字标签
    const sprite = makeTextSprite(text,
      {
        fontsize: 40,
        fontColor: textDefaultColor
      });

    sprite.material.color = toolColors.getToolColor()
    sprite.material.depthTest = false
    intersectObject.add(sprite);
    return sprite
  }

  drawSphere = (intersectObject, position, color = toolColors.getActiveColor(), fkId) => {
    const radius = this.configuration.radius
    const geometry = new THREE.SphereGeometry(radius, 8, 8);
    const material = new THREE.MeshPhongMaterial({ color, opacity: 0.6, transparent: true });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.name = this.name
    sphere.fkTissueId = intersectObject.fkId
    if (fkId) sphere.fkId = fkId
    sphere.position.copy(position)
    if (this.options.group) {
      this.options.group.add(sphere)
    } else {
      intersectObject.add(sphere)
    }
    if (this.options.onDrawSphere) {
      this.options.onDrawSphere(sphere)
    }
    return sphere
  }

  doubleClickCallback(e) {
    const eventData = e.detail
    const { element, enabledElement, currentPoints } = eventData
    const config = this.configuration;
    const toolData = getToolState(element, this.name);
    if (!toolData) return
    let nearbyHandle, activeData
    for (let data of toolData.data) {
      nearbyHandle = getHandleNearImagePoint(
        enabledElement,
        data.handles,
        currentPoints.screen,
        config.radius
      );
      if (nearbyHandle) {
        activeData = data
        break
      }
    }
    if (activeData) {
      if (this.options.openPrompt) {
        this.options.openPrompt(activeData, currentPoints.screen, true)
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
      }
    }
  }

}
