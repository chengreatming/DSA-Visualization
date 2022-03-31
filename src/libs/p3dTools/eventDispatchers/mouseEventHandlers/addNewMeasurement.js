import EVENTS from '../../events.js';
import { addToolState } from '../../stateManagement/toolState.js';
import { moveHandle, moveNewHandle } from '../../manipulators/index.js';
import triggerEvent from '../../util/triggerEvent.js';

export default function (evt, tool) {

  evt.preventDefault();
  evt.stopPropagation();
  const eventData = evt.detail;
  const element = eventData.element;
  const measurementData = tool.createNewMeasurement(eventData);
  const currentPoints = eventData.currentPoints
  if (!measurementData) {
    return;
  }

  // Associate this data with this imageId so we can render it and manipulate it
  addToolState(element, tool.name, measurementData, currentPoints);

  // external.cornerstone.updateImage(element);

  const handleMover =
    Object.keys(measurementData.handles).length === 1
      ? moveHandle
      : moveNewHandle;

  handleMover(
    eventData,
    tool.name,
    measurementData,
    measurementData.handles.end,
    tool.options,
    'mouse',
    () => {
      const eventType = EVENTS.MEASUREMENT_COMPLETED;
      const eventData = {
        toolName: tool.name,
        toolType: tool.name,
        element,
        measurementData,
        currentPoints
      };

      triggerEvent(element, eventType, eventData);
    }
  );
}
