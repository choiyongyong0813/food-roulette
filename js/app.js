/**
 * 앱 시작 지점
 *
 * index.html에서 APP_VERSION을 관리하고,
 * 여기서는 버전이 붙은 JS 모듈을 동적으로 불러온다.
 */
const version = window.APP_VERSION || "1.0.0";

const foodsModule = await import(`./FoodData.js?v=${version}`);
const rouletteModule = await import(`./FoodRoulette.js?v=${version}`);

const app = new rouletteModule.FoodRoulette(foodsModule.foods);

await app.init();