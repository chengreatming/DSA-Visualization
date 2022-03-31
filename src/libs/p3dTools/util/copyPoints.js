/**
 * Returns a copy of the points object.
 * @public
 * @function copyPoints
 *
 * @param  {Object} points - The object to copy.
 * @returns {Object} - The copy.
 */
export default function (points) {
  const ndc = points.ndc.clone();
  const world = points.world.clone();
  const screen = points.screen.clone();
  const camera = points.camera.clone();
  const page = points.page.clone()
  return {
    ndc,
    world,
    screen,
    camera,
    page
  };
}
