import BaseTool from './base/BaseTool.js';
import { zoomCursor } from './cursors/index.js';
export default class ZoomTool extends BaseTool {
  constructor(props = {}) {
    const defaultProps = {
      name: 'ZoomTool',
      supportedInteractionTypes: ['Mouse', 'Touch'],
      configuration: {
        invert: false,
        preventZoomOutsideImage: false,
        zoomSpeed: 1
      },
      svgCursor: zoomCursor,
    };

    super(props, defaultProps);
  }
  mouseDragCallback = (e) => {
    const eventData = e.detail
    const { camera, control } = eventData.enabledElement
    const delta = eventData.deltaPoints.screen
    const scale = Math.pow(0.95, this.configuration.zoomSpeed)
    function dolly(val) {
      camera.zoom *= val
      camera.updateProjectionMatrix()
    }
    if (delta.y > 0) {
      dolly(scale)
    } else if (delta.y < 0) {
      dolly(1 / scale)
    }
    if (typeof control.updateSpriteScale === 'function') {
      control.updateSpriteScale()
    }
    return true
  }
}
