import { state } from './index.js';
import { getToolState } from '../stateManagement/toolState.js';
import getHandleNearImagePoint from '../manipulators/getHandleNearImagePoint.js';

/**
 * Filters an array of tools, returning only tools with moveable handles at the
 * mouse location.
 *
 * @public
 * @function getToolsWithMoveableHandles
 *
 * @param  {HTMLElement} element The element
 * @param  {Object[]}    tools   The input tool array.
 * @param  {Object}      coords  The coordinates of the mouse position.
 * @param  {string}      [interactionType=mouse]
 * @returns {Object[]}            The filtered array.
 */
export default function (enabledElement, tools, coords, interactionType = 'mouse') {
  const element = enabledElement.domElement
  const proximity =
    interactionType === 'mouse' ? state.clickProximity : state.touchProximity;

  return tools.filter(tool => {
    const toolState = getToolState(element, tool.name);

    for (let i = 0; i < toolState.data.length; i++) {
      // 若允许在同一个位置重复标记（流域分析），跳过检测
      if (toolState.data[i].allowDuplicateMark === true) continue
      if (
        getHandleNearImagePoint(
          enabledElement,
          toolState.data[i].handles,
          coords,
          proximity
        ) !== undefined
      ) {
        return true;
      }
    }

    return false;
  });
}
