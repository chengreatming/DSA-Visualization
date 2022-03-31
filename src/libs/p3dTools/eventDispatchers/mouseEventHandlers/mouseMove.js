// State
import { getters, state } from './../../store/index.js';
import getInteractiveToolsForElement from './../../store/getInteractiveToolsForElement.js';
import getToolsWithDataForElement from './../../store/getToolsWithDataForElement.js';

/**
 * This is mostly used to update the [un]hover state
 * of a tool.
 *
 * @private
 * @param {*} evt
 * @returns {void}
 */
export default function (evt) {
  if (state.isToolLocked || state.isMultiPartToolActive) {
    return;
  }

  let tools;
  const { element, currentPoints, enabledElement } = evt.detail;
  const { control } = enabledElement
  // Set the mouse position incase any tool needs it.
  state.mousePositionNdc = currentPoints.ndc;

  // TODO: instead of filtering these for every interaction, we can change our
  // TODO: State's structure to always know these values.
  // Filter out disabled and enabled
  const interactiveTools = getInteractiveToolsForElement(element, getters.mouseTools());
  tools = interactiveTools

  const activeTools = tools.filter(
    tool => tool.mode === 'active' && tool.options.isMouseActive
  );

  let imageNeedsUpdate = false;

  // If any tools are active, check if they have a canvas cursor, and if so update image.
  if (activeTools.length > 0) {
    imageNeedsUpdate = activeTools.some(tool => tool.updateOnMouseMove);
  }

  tools = getToolsWithDataForElement(element, tools);
  tools = tools.concat(interactiveTools.filter(
    tool => tool.specialSupportedCallback.includes('mouseMove')
  ))
  // Iterate over each tool, and each tool's data
  // Activate any handles we're hovering over, or whole tools if we're near the tool
  // If we've changed the state of anything, redrawn the image
  for (let t = 0; t < tools.length; t++) {
    const tool = tools[t];

    if (typeof tool.mouseMoveCallback === 'function') {
      const needsUpdateWhenMove = tool.mouseMoveCallback(evt)
      if (needsUpdateWhenMove) {
        imageNeedsUpdate = true
      }
    }
  }

  // Tool data activation status changed, redraw the image
  if (imageNeedsUpdate === true) {
    control && control.render()
  }
}
