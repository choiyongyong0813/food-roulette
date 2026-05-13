/**
 * 룰렛 회전 담당 클래스
 *
 * 핵심:
 * - 룰렛이 멈추는 위치와 음식 결과를 분리한다.
 * - 그래서 사용자가 룰렛 색상/위치로 음식을 유추할 수 없다.
 */
export class RouletteSpinner {
  constructor(foods, renderer) {
    this.foods = foods;
    this.renderer = renderer;

    this.currentRotation = 0;
    this.isSpinning = false;
  }

  /**
   * 룰렛을 회전시킨다.
   *
   * onComplete:
   * - 회전이 끝난 뒤 선택된 음식 객체를 넘겨준다.
   */
  spin(onComplete) {
    if (this.isSpinning) return;

    this.isSpinning = true;

    /**
     * 1. 음식 결과는 랜덤으로 따로 뽑는다.
     * 이 값은 룰렛 각도와 관계없다.
     */
    const selectedFoodIndex = Math.floor(Math.random() * this.foods.length);
    const selectedFood = this.foods[selectedFoodIndex];

    /**
     * 2. 룰렛이 멈출 위치도 랜덤으로 따로 뽑는다.
     * 이 값도 음식 결과와 관계없다.
     */
    const randomStopAngle = Math.random() * Math.PI * 2;

    /**
     * 3. 여러 바퀴 돌린 뒤 랜덤 위치에서 멈추게 한다.
     */
    const fullRotations = Math.PI * 2 * 6;

    const startRotation = this.currentRotation;
    const finalRotation = startRotation + fullRotations + randomStopAngle;

    const duration = 4000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = this.easeOutCubic(progress);

      this.currentRotation =
        startRotation + (finalRotation - startRotation) * easedProgress;

      this.renderer.draw(this.currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isSpinning = false;

        this.currentRotation = this.currentRotation % (Math.PI * 2);

        if (onComplete) {
          onComplete(selectedFood);
        }
      }
    };

    requestAnimationFrame(animate);
  }

  /**
   * 감속 효과
   */
  easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }
}