/**
 * 룰렛 회전 담당 클래스
 *
 * 역할:
 * - 랜덤 음식 선택
 * - 목표 각도 계산
 * - 감속 애니메이션 처리
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
   * 반환값:
   * - 최종 선택된 음식 객체
   */
  spin(onComplete) {
    if (this.isSpinning) return;

    this.isSpinning = true;

    const selectedIndex = Math.floor(Math.random() * this.foods.length);
    const selectedFood = this.foods[selectedIndex];

    const sliceAngle = (Math.PI * 2) / this.foods.length;

    /**
     * 화살표가 위쪽에 고정되어 있으므로
     * 선택된 칸의 중앙이 위쪽 화살표에 오도록 목표 각도를 계산한다.
     */
    const selectedMiddleAngle =
      selectedIndex * sliceAngle + sliceAngle / 2;

    const fullRotations = Math.PI * 2 * 6;

    const targetRotation =
      fullRotations - selectedMiddleAngle;

    const startRotation = this.currentRotation;
    const finalRotation = startRotation + targetRotation;

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

        // 각도가 너무 커지는 것을 방지하기 위해 0~2π 범위로 정리
        this.currentRotation = this.currentRotation % (Math.PI * 2);

        if (onComplete) {
          onComplete(selectedFood);
        }
      }
    };

    requestAnimationFrame(animate);
  }

  /**
   * 감속 효과 함수
   *
   * 처음에는 빠르게 돌고,
   * 끝으로 갈수록 천천히 멈추는 느낌을 만든다.
   */
  easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }
}