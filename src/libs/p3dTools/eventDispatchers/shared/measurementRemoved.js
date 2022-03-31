import { state } from './../../store/index.js';
import getToolForElement from '../../store/getToolForElement';

export default function (evt) {
  const { element, toolName } = evt.detail;
  const activeTool = getToolForElement(element, toolName);
  if (activeTool && typeof activeTool.onMeasurementRemoved === 'function') {
    activeTool.onMeasurementRemoved.call(activeTool, evt)
  }
}