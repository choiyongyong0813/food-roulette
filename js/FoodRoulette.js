import { RouletteRenderer } from "./RouletteRenderer.js";
import { RouletteSpinner } from "./RouletteSpinner.js";
import { SoundManager } from "./SoundManager.js";

/**
 * 음식 룰렛 앱 전체 제어 클래스
 *
 * 역할:
 * - 버튼 이벤트 연결
 * - 룰렛 그리기 초기화
 * - 회전 시작/종료 제어
 * - 결과 화면 출력
 */
export class FoodRoulette {
  constructor(foods) {
    this.foods = foods;

    this.canvas = document.getElementById("rouletteCanvas");

    this.spinButton = document.getElementById("spinButton");
    this.spinCenterButton = document.getElementById("spinCenterButton");

    this.resultText = document.getElementById("resultText");
    this.resultImage = document.getElementById("resultImage");

    this.renderer = new RouletteRenderer(this.canvas, this.foods);
    this.spinner = new RouletteSpinner(this.foods, this.renderer);
    this.soundManager = new SoundManager();
  }

  /**
   * 앱 초기 실행 함수
   */
  async init() {
    await this.renderer.loadImages();

    this.renderer.draw();

    this.bindEvents();
  }

  /**
   * 버튼 클릭 이벤트 연결
   */
  bindEvents() {
    this.spinButton.addEventListener("click", () => {
      this.startSpin();
    });

    this.spinCenterButton.addEventListener("click", () => {
      this.startSpin();
    });
  }

  /**
   * 룰렛 회전 시작
   */
  startSpin() {
    if (this.spinner.isSpinning) return;

    this.setButtonsDisabled(true);
    this.clearResult();

    this.soundManager.playSpinSound();

    this.spinner.spin((selectedFood) => {
      this.soundManager.stopSpinSound();
      this.soundManager.playWinSound();

      this.showResult(selectedFood);
      this.setButtonsDisabled(false);

      this.vibrate();
    });
  }

  /**
   * 결과 초기화
   */
clearResult() {
  this.resultText.textContent = "돌아가는 중...";
  this.resultImage.style.display = "none";
  this.resultImage.src = "";
}

  /**
   * 결과 출력
   */
showResult(food) {
  this.resultText.textContent = "이 음식은 뭘까요?";

  this.resultImage.src = food.image;
  this.resultImage.style.display = "inline-block";
}
  /**
   * 버튼 활성/비활성 처리
   */
  setButtonsDisabled(disabled) {
    this.spinButton.disabled = disabled;
    this.spinCenterButton.disabled = disabled;
  }

  /**
   * 모바일 진동
   */
  vibrate() {
    if (navigator.vibrate) {
      navigator.vibrate(300);
    }
  }
}