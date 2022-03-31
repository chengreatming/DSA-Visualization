// Modules
import cursor from './modules/cursorModule.js';
import globalConfiguration from './modules/globalConfigurationModule.js';

export const state = {
  // Global
  globalTools: {},
  globalToolChangeHistory: [],
  // Tracking
  enabledElements: [],
  tools: [],
  isToolLocked: false,
  activeMultiPartTool: null,
  mousePositionNdc: {},
  // Settings
  clickProximity: 6,
  touchProximity: 10,
  handleRadius: 6,
  deleteIfHandleOutsideImage: true,
  preventHandleOutsideImage: false,
  // Cursor
  svgCursorUrl: null,
};

export const getters = {
  mouseTools: () =>
    state.tools.filter(tool =>
      tool.supportedInteractionTypes.includes('Mouse')
    ),
  touchTools: () =>
    state.tools.filter(tool =>
      tool.supportedInteractionTypes.includes('Touch')
    )
};

export const setters = {};

export const modules = {
  cursor,
  globalConfiguration,
};

export function getModule(moduleName) {
  return modules[moduleName];
}

export default {
  modules,
  state,
  getters,
};
