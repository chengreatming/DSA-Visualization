import { BaseBrushTool } from '../base';
import coordsTransform from '../../util/coordsTransform'
import * as THREE from 'three'

/**
 * @public
 * @class ScalpelTool
 * @memberof Tools.ScalpelTool
 * @classdesc Tool for drawing segmentations on an image.
 * @extends Tools.Base.BaseBrushTool
 */
export default class ScalpelTool extends BaseBrushTool {
  constructor(props = {}) {
    const defaultProps = {
      name: 'ScalpelTool',
      supportedInteractionTypes: ['Mouse', 'Touch'],
      configuration: {},
    };

    super(props, defaultProps);

    this.touchDragCallback = this._paint.bind(this);

    // 线的载体
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(100 * 3); // 3 vertices per point
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.LineBasicMaterial({
      color: 0xff0000,
      depthWrite: false,
      depthTest: false,
      transparent: true
    });
    this.line = new THREE.Line(geometry, material);
    this.line.renderOrder = 2000
    this.line.name = 'scalpelLine'
  }

  /**
   * Paints the data to the labelmap.
   *
   * @protected
   * @param  {Object} evt The data object associated with the event.
   * @returns {void}
   */
  _paint(e) {
    const eventData = e.detail
    const { control } = eventData.enabledElement
    const points = this.mouseTrail.map(p => p.world)
    points.push(this.mouseTrail[0].world)
    this.line.geometry.setFromPoints(points)
    this.line.geometry.attributes.position.needsUpdate = true;
    this.line.geometry.computeBoundingSphere()
    control && control.render()
  }

  _startPainting(e) {
    const eventData = e.detail
    const { scene } = eventData.enabledElement
    const line = scene.getObjectByName(this.line.name)
    if (!line) {
      scene.add(this.line)
    }
  }

  _endPainting(e) {

  }

}
