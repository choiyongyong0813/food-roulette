import { foods } from "./FoodData.js";
import { FoodRoulette } from "./FoodRoulette.js";

/**
 * 앱 시작 지점
 */
document.addEventListener("DOMContentLoaded", async () => {
  const app = new FoodRoulette(foods);

  await app.init();
});