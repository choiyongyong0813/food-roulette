/**
 * 효과음 관리 클래스
 *
 * spinSound: 룰렛이 돌아갈 때 재생
 * winSound : 결과가 나왔을 때 재생
 */
export class SoundManager {
  constructor() {
    this.spinSound = document.getElementById("spinSound");
    this.winSound = document.getElementById("winSound");
  }

  /**
   * 룰렛 회전음 재생
   */
  playSpinSound() {
    if (!this.spinSound) return;

    this.spinSound.currentTime = 0;
    this.spinSound.loop = true;
    this.spinSound.play().catch(() => {
      // 모바일 브라우저에서 자동 재생이 막힐 수 있으므로 무시
    });
  }

  /**
   * 룰렛 회전음 정지
   */
  stopSpinSound() {
    if (!this.spinSound) return;

    this.spinSound.pause();
    this.spinSound.currentTime = 0;
  }

  /**
   * 당첨 효과음 재생
   */
  playWinSound() {
    if (!this.winSound) return;

    this.winSound.currentTime = 0;
    this.winSound.play().catch(() => {
      // 효과음 재생 실패 시 앱 동작에는 영향 없음
    });
  }
}