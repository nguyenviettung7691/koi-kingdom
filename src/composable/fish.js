import { toValue } from "vue";

export function useFishCurrentLifecycle(alive, totalLifetime, fishLifeCycles) {
  alive = toValue(alive);
  totalLifetime = toValue(totalLifetime);
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

export function useFishTotalLifetime(birthtime) {
  birthtime = toValue(birthtime);
  return { totalLifetime: (Date.now() - birthtime) / 1000 };
}
