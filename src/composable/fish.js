import { toValue } from "vue";

/**
 * Returns the current lifecycle of a fish based on its alive status, total lifetime, and fish life cycles.
 *
 * @param {boolean} alive - The alive status of the fish.
 * @param {number} totalLifetime - The total lifetime of the fish in milliseconds.
 * @param {Array} fishLifeCycles - The array of fish life cycles.
 * @return {Object} An object containing the current lifecycle of the fish.
 */
export function useFishCurrentLifecycle(alive, totalLifetime, fishLifeCycles) {
  alive = toValue(alive);
  totalLifetime = toValue(totalLifetime) / 1000;
  fishLifeCycles = toValue(fishLifeCycles);
  let lifecycle = null;

  if (fishLifeCycles && alive) {
    for (let i = 0; i < fishLifeCycles.length; i++) {
      let lc = fishLifeCycles[i];
      if (totalLifetime <= lc.miniumLifetime) {
        lc["stars"] = i;
        lifecycle = lc;
        break;
      }
    }
  }

  return { lifecycle };
}

/**
 * Calculates the total lifetime of a fish based on its birthtime.
 *
 * @param {number} birthtime - The birthtime of the fish in milliseconds.
 * @return {Object} An object containing the total lifetime of the fish in milliseconds.
 */
export function useFishTotalLifetime(birthtime) {
  birthtime = toValue(birthtime);
  return { totalLifetime: Date.now() - birthtime };
}
