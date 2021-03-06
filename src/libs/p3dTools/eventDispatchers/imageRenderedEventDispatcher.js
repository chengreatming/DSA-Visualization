

import { state, getModule } from './../store/index.js';
import { getToolState } from '../stateManagement/toolState';
import external from './../externalModules.js';

const segmentationModule = getModule('segmentation');

const onImageRendered = function (evt) {
  const eventData = evt.detail;
  const element = eventData.element;

  // Render Annotation Tools
  const toolsToRender = state.tools.filter(
    tool =>
      tool.element === element &&
      (tool.mode === 'active' ||
        tool.mode === 'passive' ||
        tool.mode === 'enabled')
  );

  // Must be using stacks in order to use segmentation tools.
  // const stackToolState = getToolState(element, 'stack');

  // const segmentationConfiguration = segmentationModule.configuration;

  // if (
  //   stackToolState &&
  //   (segmentationConfiguration.renderFill ||
  //     segmentationConfiguration.renderOutline)
  // ) {
  //   onImageRenderedBrushEventHandler(evt);
  // }

  toolsToRender.forEach(tool => {
    if (tool.renderToolData) {
      tool.renderToolData(evt);
    }
  });
};

const enable = function (element) {
  element.addEventListener(
    external.cornerstone.EVENTS.IMAGE_RENDERED,
    onImageRendered
  );
};

const disable = function (element) {
  element.removeEventListener(
    external.cornerstone.EVENTS.IMAGE_RENDERED,
    onImageRendered
  );
};

export default {
  enable,
  disable,
};
