/**
 * Canvas에 룰렛판을 그리는 클래스
 *
 * 역할:
 * - 음식 개수에 맞춰 부채꼴 칸 생성
 * - 각 칸에 배경색 적용
 * - 음식 이름 표시
 * - 음식 이미지 표시
 */
export class RouletteRenderer {
  constructor(canvas, foods) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.foods = foods;

    this.centerX = canvas.width / 2;
    this.centerY = canvas.height / 2;
    this.radius = canvas.width / 2 - 20;

    this.loadedImages = new Map();
  }

  /**
   * 음식 이미지를 미리 로딩한다.
   * 이미지가 늦게 로딩되면 Canvas에 안 보일 수 있으므로 사전 로딩이 필요하다.
   */
  async loadImages() {
    const loadPromises = this.foods.map((food) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = food.image;

        img.onload = () => {
          this.loadedImages.set(food.name, img);
          resolve();
        };

        img.onerror = () => {
          console.warn(`${food.name} 이미지 로딩 실패`);
          resolve();
        };
      });
    });

    await Promise.all(loadPromises);
  }

  /**
   * 룰렛판 전체를 그린다.
   *
   * rotationAngle:
   * - 현재 룰렛이 얼마나 회전했는지 나타내는 각도
   * - 단위는 라디안
   */
  draw(rotationAngle = 0) {
    const ctx = this.ctx;
    const sliceAngle = (Math.PI * 2) / this.foods.length;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();

    // Canvas 중심을 기준으로 회전시키기 위해 좌표 이동
    ctx.translate(this.centerX, this.centerY);
    ctx.rotate(rotationAngle);
    ctx.translate(-this.centerX, -this.centerY);

    for (let i = 0; i < this.foods.length; i++) {
      const food = this.foods[i];

      const startAngle = i * sliceAngle - Math.PI / 2;
      const endAngle = startAngle + sliceAngle;

      this.drawSlice(startAngle, endAngle, food.color);
      this.drawFoodContent(startAngle, endAngle, food);
    }

    ctx.restore();

    this.drawOuterCircle();
  }

  /**
   * 부채꼴 칸 하나를 그린다.
   */
  drawSlice(startAngle, endAngle, color) {
    const ctx = this.ctx;

    ctx.beginPath();
    ctx.moveTo(this.centerX, this.centerY);
    ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle);
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();

    ctx.strokeStyle = "#111";
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  /**
   * 음식 이미지와 이름을 그린다.
   */
  drawFoodContent(startAngle, endAngle, food) {
    const ctx = this.ctx;

    const middleAngle = (startAngle + endAngle) / 2;

    const textRadius = this.radius * 0.65;
    const imageRadius = this.radius * 0.47;

    const textX = this.centerX + Math.cos(middleAngle) * textRadius;
    const textY = this.centerY + Math.sin(middleAngle) * textRadius;

    const imageX = this.centerX + Math.cos(middleAngle) * imageRadius;
    const imageY = this.centerY + Math.sin(middleAngle) * imageRadius;

    const img = this.loadedImages.get(food.name);

    if (img) {
      const imageSize = 70;
      ctx.drawImage(
        img,
        imageX - imageSize / 2,
        imageY - imageSize / 2,
        imageSize,
        imageSize
      );
    }

    // 텍스트 외곽선
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#111";
    ctx.strokeText(food.name, textX, textY);

    // 텍스트 내부 색
    ctx.fillStyle = "#ffffff";
    ctx.fillText(food.name, textX, textY);
  }

  /**
   * 룰렛 바깥 테두리를 그린다.
   */
  drawOuterCircle() {
    const ctx = this.ctx;

    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 8;
    ctx.stroke();
  }
}