import { state } from './../../store/index.js';
import getToolForElement from '../../store/getToolForElement';

export default function (evt) {
  const { element, toolName } = evt.detail;
  const activeTool = getToolForElement(element, toolName);
  if (activeTool && typeof activeTool.onMeasurementModified === 'function') {
    activeTool.onMeasurementModified.call(activeTool, evt)
  }
}