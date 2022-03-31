import init from './init'
import EVENTS from './events'

// ~~~~~~ STATE MANAGEMENT ~~~~~ //
import { default as store } from './store/index.js';
import { getModule } from './store/index.js';

import { default as getToolForElement } from './store/getToolForElement.js';
import { addTool, addToolForElement } from './store/addTool.js';
import { removeTool, removeToolForElement } from './store/removeTool.js';
import {
  setToolOptions,
  setToolOptionsForElement,
} from './store/setToolOptions.js';
import {
  setToolActive,
  setToolActiveForElement,
  setToolEnabled,
  setToolEnabledForElement,
  setToolDisabled,
  setToolDisabledForElement,
  setToolPassive,
  setToolPassiveForElement,
} from './store/setToolMode.js';
import isToolActiveForElement from './store/isToolActiveForElement';
import {
  ZoomTool,
  PanTool,
  RotateTool,
  ZoomMouseWheelTool,
  TextMarkerTool,
  ClipBoxTool,
  NavPointTool,
  ScalpelTool,
  RulerTool,
  AngleTool,
  BallTool,
} from './tools/index.js'
import addEnabledElement from './store/internals/addEnabledElement'
import removeEnabledElement from './store/internals/removeEnabledElement'
import getEnabledElement from './store/getEnabledElement'
import {
  addToolState,
  getToolState,
  removeToolState,
  clearToolState,
  selecteToolState,
  deleteSelecteToolState,
  setElementToolStateManager,
  getElementToolStateManager,
} from './stateManagement/toolState.js';
import toolColors from './stateManagement/toolColors';
const p3dTools = {
  init,
  EVENTS,
  store,
  getModule,
  getToolForElement,
  addTool,
  addToolForElement,
  removeTool,
  removeToolForElement,
  setToolOptions,
  setToolOptionsForElement,
  isToolActiveForElement,
  setToolActive,
  setToolActiveForElement,
  setToolEnabled,
  setToolEnabledForElement,
  setToolDisabled,
  setToolDisabledForElement,
  setToolPassive,
  setToolPassiveForElement,
  addEnabledElement,
  getEnabledElement,
  removeEnabledElement,
  ZoomTool,
  ZoomMouseWheelTool,
  PanTool,
  RotateTool,
  ClipBoxTool,
  NavPointTool,
  //annotation tool
  TextMarkerTool,
  //setmentation tool
  ScalpelTool,
  RulerTool,
  AngleTool,
  BallTool,
  //stateManager
  addToolState,
  getToolState,
  selecteToolState,
  deleteSelecteToolState,
  removeToolState,
  clearToolState,
  setElementToolStateManager,
  getElementToolStateManager,
  toolColors
}

p3dTools.hasTool = function (name) {
  if (typeof name !== 'string') return false
  const suffix = 'Tool'
  name = name.charAt(0).toUpperCase() + name.slice(1)
  name = name.includes('Tool') ? name : name + suffix
  return p3dTools.hasOwnProperty(name) ? name : false
}
export default p3dTools