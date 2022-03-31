import { getters, state } from './../../store/index.js';
import getActiveToolsForElement from './../../store/getActiveToolsForElement.js';
import getInteractiveToolsForElement from './../../store/getInteractiveToolsForElement.js';
import triggerEvent from '../../util/triggerEvent';
import EVENTS from '../../events';
import filterToolsUseableWithMultiPartTools from './../../store/filterToolsUsableWithMultiPartTools.js';
// Tools like wwwc. Non-annotation tools w/ specific
// Down + mouse behavior
// TODO: I don't like filtering in drag because it's such
// A high frequency event. Anything we can do to reduce
// Repeat math here would be a big help
export default function (evt) {
  if (state.isToolLocked) {
    return;
  }

  let tools;
  const eventData = evt.detail;
  const element = eventData.element;

  // Filter out disabled, enabled, and passive
  tools = getActiveToolsForElement(element, getters.mouseTools());
  tools = tools.filter(
    tool =>
      Array.isArray(tool.options.mouseButtonMask) &&
      tool.options.mouseButtonMask.includes(eventData.buttons) &&
      tool.options.isMouseActive
  );
  tools = tools.filter(tool => typeof tool.mouseDragCallback === 'function');

  if (state.isMultiPartToolActive) {
    tools = filterToolsUseableWithMultiPartTools(tools);
  }

  const specialTools = getInteractiveToolsForElement(element, getters.mouseTools()).filter(
    tool => tool.specialSupportedCallback.includes('mouseDrag')
  )

  if (specialTools.length > 0 && specialTools[0].activeObj) {
    specialTools[0].mouseDragCallback(evt);
    return;
  }

  if (tools.length === 0) {
    return;
  }

  const activeTool = tools[0];

  const needUpdate = activeTool.mouseDragCallback(evt);

  if (needUpdate) {
    triggerEvent(element, EVENTS.UPDATE_IMAGE, eventData);
  }
}
