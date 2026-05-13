/**
 * 음식 데이터 관리 파일
 */
const version = window.APP_VERSION || "1.0.0";

export const foods = [
  {
    name: "햄버거",
    image: `./images/burger1.jpg?v=${version}`,
    color: "#ff9800"
  },
  {
    name: "마라탕",
    image: `./images/mara1.jpg?v=${version}`,
    color: "#ff0000"
  }
];