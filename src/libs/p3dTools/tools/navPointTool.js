import BaseTool from './base/BaseTool.js';
import coordinatePicking from '../util/coordinatePicking'

export default class NavPoint extends BaseTool {
  constructor(props = {}) {
    const defaultProps = {
      name: 'NavPointTool',
      supportedInteractionTypes: ['Mouse', 'Touch'],
      svgCursor: null,
      configuration: {
        mouseDownCallback: () => { console.log('navPoint') }
      }
    };

    super(props, defaultProps);
  }
  preMouseDownCallback = (e) => {
    const eventData = e.detail
    const { mouseDownCallback } = this.options
    const { enabledElement, currentPoints } = eventData
    const intersect = coordinatePicking(enabledElement, currentPoints)
    if (typeof mouseDownCallback === 'function' && intersect) {
      mouseDownCallback(intersect.point)
    }
  }
}