import { state } from './../../store/index.js';
import getToolForElement from '../../store/getToolForElement';

export default function (evt) {
  const { element, toolName, measurementData } = evt.detail;
  const activeTool = getToolForElement(element, toolName);
  measurementData.isCompleted = true
  if (activeTool && typeof activeTool.onMeasurementCompleted === 'function') {
    activeTool.onMeasurementCompleted.call(activeTool, evt)
  }
}