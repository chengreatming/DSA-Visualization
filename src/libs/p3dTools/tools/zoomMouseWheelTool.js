import BaseTool from './base/BaseTool.js';

/**
 * @public
 * @class ZoomMouseWheelTool
 * @memberof Tools
 *
 * @classdesc Tool for changing magnification with the mouse wheel.
 * @extends Tools.Base.BaseTool
 */
export default class ZoomMouseWheelTool extends BaseTool {
  constructor(props = {}) {
    const defaultProps = {
      name: 'ZoomMouseWheelTool',
      supportedInteractionTypes: ['MouseWheel'],
      configuration: {
        invert: false,
        preventZoomOutsideImage: false,
        zoomSpeed: 1,
        minScale: 0.25,
        maxScale: 20.0,
      },
    };

    super(props, defaultProps);
  }
  mouseWheelCallback = (e) => {
    const { spinY } = e.detail;
    const { invert, maxScale, minScale } = this.configuration;
    const { camera, control } = e.detail.enabledElement
    const scale = Math.pow(0.95, this.configuration.zoomSpeed)
    function dolly(val) {
      camera.zoom *= val
      camera.updateProjectionMatrix()
    }
    if (spinY > 0) {
      dolly(scale)
    } else if (spinY < 0) {
      dolly(1 / scale)
    }
    if (typeof control.updateSpriteScale === 'function') {
      control.updateSpriteScale()
    }
    return true
  }
}
