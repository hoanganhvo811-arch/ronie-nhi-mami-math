// src/game/scenes/WorldMapScene.ts
// Bản đồ Thế Giới 2.5D của Vương Quốc Toán Học (Phaser 3)

import Phaser from 'phaser';
import { gameBridge } from '../bridge/GameBridgeService';
import { ZONES_CONFIG } from '../../features/quests/questData';

export class WorldMapScene extends Phaser.Scene {
  private ronieSprite!: Phaser.GameObjects.Container;
  private zoneContainers: Phaser.GameObjects.Container[] = [];
  private isMoving: boolean = false;

  constructor() {
    super({ key: 'WorldMapScene' });
  }

  create(): void {
    const { width, height } = this.scale;

    // 1. NỀN THẾ GIỚI HUYỀN ẢO (FANTASY SKY & TERRAIN)
    const bgGraphics = this.add.graphics();
    bgGraphics.fillGradientStyle(0x0284c7, 0x0284c7, 0x0f172a, 0x0f172a, 1);
    bgGraphics.fillRect(0, 0, width, height);

    // Con đường tơ sao kết nối 5 Vùng Đất
    const pathGraphics = this.add.graphics();
    pathGraphics.lineStyle(6, 0xfde047, 0.7);

    // Vị trí 5 Vùng đất trên bản đồ (Hình chữ S uốn lượn)
    const zoneCoords = [
      { x: 180, y: 520, zone: ZONES_CONFIG[0] }, // Vùng 1: Rừng Số Đếm (Tây Nam)
      { x: 380, y: 260, zone: ZONES_CONFIG[1] }, // Vùng 2: Thung Lũng Cộng (Tây Bắc)
      { x: 640, y: 460, zone: ZONES_CONFIG[2] }, // Vùng 3: Hẻm Núi Trừ (Trung tâm)
      { x: 900, y: 220, zone: ZONES_CONFIG[3] }, // Vùng 4: Lâu Đài Hình Khối (Đông Bắc)
      { x: 1100, y: 480, zone: ZONES_CONFIG[4] }, // Vùng 5: Đấu Trường Trăm Điểm (Đông Nam)
    ];

    // Vẽ đường nối giữa các vùng
    pathGraphics.beginPath();
    pathGraphics.moveTo(zoneCoords[0].x, zoneCoords[0].y);
    for (let i = 1; i < zoneCoords.length; i++) {
      pathGraphics.lineTo(zoneCoords[i].x, zoneCoords[i].y);
    }
    pathGraphics.strokePath();

    // 2. DỰNG 5 ĐIỂM MỐC VÙNG ĐẤT (ZONE GATEWAYS)
    zoneCoords.forEach((coord, index) => {
      const container = this.add.container(coord.x, coord.y);

      // Vòng tròn hào quang nền
      const glow = this.add.graphics();
      glow.fillStyle(parseInt(coord.zone.color.replace('#', '0x'), 16), 0.35);
      glow.fillCircle(0, 0, 65);
      container.add(glow);

      // Khối đảo đất 2.5D
      const island = this.add.graphics();
      island.fillStyle(parseInt(coord.zone.color.replace('#', '0x'), 16), 0.9);
      island.fillRoundedRect(-50, -45, 100, 90, 24);
      island.lineStyle(4, 0xffffff, 0.9);
      island.strokeRoundedRect(-50, -45, 100, 90, 24);
      container.add(island);

      // Icon biểu tượng vùng đất
      const iconText = this.add.text(0, -10, coord.zone.icon, {
        fontSize: '40px',
      }).setOrigin(0.5);
      container.add(iconText);

      // Tiêu đề vùng đất
      const titleText = this.add.text(0, 58, `Vùng ${index + 1}\n${coord.zone.title}`, {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '15px',
        fontStyle: 'bold',
        color: '#FFFFFF',
        align: 'center',
        stroke: '#0F172A',
        strokeThickness: 4,
      }).setOrigin(0.5, 0);
      container.add(titleText);

      // Hiệu ứng tương tác chạm / click
      container.setSize(120, 120);
      container.setInteractive({ useHandCursor: true });

      container.on('pointerover', () => {
        this.tweens.add({
          targets: container,
          scale: 1.1,
          duration: 180,
          ease: 'Back.easeOut',
        });
      });

      container.on('pointerout', () => {
        this.tweens.add({
          targets: container,
          scale: 1.0,
          duration: 180,
          ease: 'Back.easeIn',
        });
      });

      container.on('pointerdown', () => {
        this.handleZoneClick(coord.x, coord.y, coord.zone.id);
      });

      this.zoneContainers.push(container);
    });

    // 3. NHÂN VẬT RONIE TRÊN BẢN ĐỒ (RONIE TOKEN)
    this.createRonieToken(zoneCoords[0].x, zoneCoords[0].y - 30);

    // 4. MÂY BAY LƯỢN HOẠT HÌNH
    this.createFloatingClouds(width, height);

    // Báo hiệu Scene đã sẵn sàng cho React
    gameBridge.emit('SCENE_READY', { sceneKey: 'WorldMapScene' });
  }

  private createRonieToken(startX: number, startY: number): void {
    this.ronieSprite = this.add.container(startX, startY);

    // Vòng phát sáng dưới chân
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.4);
    shadow.fillEllipse(0, 32, 40, 16);
    this.ronieSprite.add(shadow);

    // Huy hiệu Ronie Nhện Nhí
    const body = this.add.graphics();
    body.fillStyle(0xe11d48, 1); // Red Ruby
    body.fillCircle(0, 0, 26);
    body.lineStyle(3, 0xfde047, 1); // Gold
    body.strokeCircle(0, 0, 26);
    this.ronieSprite.add(body);

    const ronieIcon = this.add.text(0, -2, '🕷️', {
      fontSize: '26px',
    }).setOrigin(0.5);
    this.ronieSprite.add(ronieIcon);

    // Nhãn tên Ronie trên đầu
    const nameLabel = this.add.text(0, -38, 'Ronie', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#FEF08A',
      stroke: '#9F1239',
      strokeThickness: 3,
    }).setOrigin(0.5);
    this.ronieSprite.add(nameLabel);

    // Nhịp thở nhún nhảy nhẹ
    this.tweens.add({
      targets: this.ronieSprite,
      y: startY - 8,
      duration: 650,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createFloatingClouds(width: number, height: number): void {
    for (let i = 0; i < 4; i++) {
      const cloud = this.add.text(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(40, height * 0.4),
        '☁️',
        { fontSize: `${Phaser.Math.Between(40, 70)}px` }
      ).setAlpha(0.45);

      this.tweens.add({
        targets: cloud,
        x: width + 100,
        duration: Phaser.Math.Between(25000, 45000),
        repeat: -1,
        onRepeat: () => {
          cloud.x = -100;
          cloud.y = Phaser.Math.Between(40, height * 0.4);
        },
      });
    }
  }

  private handleZoneClick(targetX: number, targetY: number, zoneId: number): void {
    if (this.isMoving) return;
    this.isMoving = true;

    // Di chuyển Ronie đến vùng đất được chọn
    this.tweens.add({
      targets: this.ronieSprite,
      x: targetX,
      y: targetY - 30,
      duration: 700,
      ease: 'Power2',
      onComplete: () => {
        this.isMoving = false;
        // Bắn pháo sáng tơ nhện
        gameBridge.emit('MATH_TRIGGERED', { zoneId, stageId: 1 });
      },
    });
  }
}
