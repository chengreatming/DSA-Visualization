import { state } from './../../store/index.js';
import getToolForElement from '../../store/getToolForElement';

export default function (evt) {
  const { element, toolName, toolType, measurementData } = evt.detail;
  const activeTool = getToolForElement(element, toolName || toolType);
  measurementData.isCompleted = false
  if (activeTool && typeof activeTool.onMeasurementAdded === 'function') {
    activeTool.onMeasurementAdded.call(activeTool, evt)
  }
}