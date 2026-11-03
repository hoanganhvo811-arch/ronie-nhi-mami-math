// src/game/scenes/WorldMapScene.ts
// Bản đồ Thế Giới 2.5D - 5 Vùng Đất Vương Quốc Toán Học với 4 Trạng Thái (Phase 1)

import Phaser from 'phaser';
import { gameBridge } from '../bridge/GameBridgeService';
import { ZONES_CONFIG } from '../../features/quests/questData';
import type { IZoneInfo, ZoneStatus } from '../../types/game';

export class WorldMapScene extends Phaser.Scene {
  private ronieSprite!: Phaser.GameObjects.Container;
  private isMoving: boolean = false;

  constructor() {
    super({ key: 'WorldMapScene' });
  }

  create(): void {
    const { width, height } = this.scale;

    // 1. NỀN THẾ GIỚI PASTEL FANTASY (BẦU TRỜI & ĐỒI NÚI 2.5D)
    const bgGraphics = this.add.graphics();
    bgGraphics.fillGradientStyle(0xbae6fd, 0xfce7f3, 0xfef3c7, 0xd1fae5, 1);
    bgGraphics.fillRect(0, 0, width, height);

    // 2. CON ĐƯỜNG TƠ SAO NỐI 5 VÙNG ĐẤT (STAR-WEB PATHWAY)
    const zoneCoords = [
      { x: 190, y: 500, zone: ZONES_CONFIG[0] }, // Vùng 1: Rừng số kỳ diệu
      { x: 390, y: 240, zone: ZONES_CONFIG[1] }, // Vùng 2: Thung lũng cộng trừ
      { x: 640, y: 450, zone: ZONES_CONFIG[2] }, // Vùng 3: Cầu vồng hình học
      { x: 890, y: 230, zone: ZONES_CONFIG[3] }, // Vùng 4: Hang kho báu
      { x: 1090, y: 470, zone: ZONES_CONFIG[4] }, // Vùng 5: Thành phố thời gian
    ];

    const pathGraphics = this.add.graphics();
    // Đường tơ sao vàng óng viền trắng
    pathGraphics.lineStyle(14, 0xffffff, 0.8);
    pathGraphics.beginPath();
    pathGraphics.moveTo(zoneCoords[0].x, zoneCoords[0].y);
    for (let i = 1; i < zoneCoords.length; i++) {
      pathGraphics.lineTo(zoneCoords[i].x, zoneCoords[i].y);
    }
    pathGraphics.strokePath();

    pathGraphics.lineStyle(8, 0xfbbf24, 0.95);
    pathGraphics.beginPath();
    pathGraphics.moveTo(zoneCoords[0].x, zoneCoords[0].y);
    for (let i = 1; i < zoneCoords.length; i++) {
      pathGraphics.lineTo(zoneCoords[i].x, zoneCoords[i].y);
    }
    pathGraphics.strokePath();

    // 3. DỰNG 5 ĐIỂM MỐC VÙNG ĐẤT VỚI 4 TRẠNG THÁI HIỂN THỊ
    zoneCoords.forEach((coord, index) => {
      this.createZoneGateway(coord.x, coord.y, coord.zone, index + 1);
    });

    // 4. NHÂN VẬT RONIE TRÊN BẢN ĐỒ
    this.createRonieToken(zoneCoords[0].x, zoneCoords[0].y - 35);

    // 5. TRANG TRÍ MÂY & BƯỚM LƯỢN LỜ
    this.createFloatingPastelClouds(width, height);

    // Báo hiệu Scene sẵn sàng
    gameBridge.emit('SCENE_READY', { sceneKey: 'WorldMapScene' });
  }

  private createZoneGateway(x: number, y: number, zone: IZoneInfo, zoneNum: number): void {
    const container = this.add.container(x, y);
    const status: ZoneStatus = zone.status;

    // A. HÀO QUANG THEO TRẠNG THÁI
    const glow = this.add.graphics();
    if (status === 'completed') {
      glow.fillStyle(0xfbbf24, 0.45); // Vàng kim rực rỡ
      glow.fillCircle(0, 0, 75);
    } else if (status === 'in_progress') {
      glow.fillStyle(0x38bdf8, 0.4); // Xanh dương tươi sáng
      glow.fillCircle(0, 0, 70);
    } else if (status === 'unlocked') {
      glow.fillStyle(0x4ade80, 0.35); // Xanh lá mở khóa
      glow.fillCircle(0, 0, 65);
    } else {
      glow.fillStyle(0x94a3b8, 0.25); // Xám khói khóa
      glow.fillCircle(0, 0, 60);
    }
    container.add(glow);

    // B. ĐẢO ĐẤT 2.5D PASTEL
    const island = this.add.graphics();
    const primaryColor = status === 'locked' ? 0x94a3b8 : parseInt(zone.color.replace('#', '0x'), 16);

    // Đổ bóng 2.5D
    island.fillStyle(0x000000, 0.15);
    island.fillEllipse(0, 48, 110, 32);

    // Mặt đảo bo tròn
    island.fillStyle(primaryColor, status === 'locked' ? 0.75 : 0.95);
    island.fillRoundedRect(-55, -45, 110, 90, 26);
    island.lineStyle(4, 0xffffff, 0.95);
    island.strokeRoundedRect(-55, -45, 110, 90, 26);
    container.add(island);

    // C. BIỂU TƯỢNG VÙNG ĐẤT
    const iconText = this.add.text(0, -10, zone.icon, {
      fontSize: '44px',
    }).setOrigin(0.5);
    if (status === 'locked') iconText.setAlpha(0.6);
    container.add(iconText);

    // D. BADGE TRẠNG THÁI TRÊN ĐỈNH ĐẢO
    const badgeContainer = this.add.container(0, -52);
    const badgeBg = this.add.graphics();

    if (status === 'completed') {
      badgeBg.fillStyle(0xfef08a, 1);
      badgeBg.fillRoundedRect(-42, -12, 84, 24, 12);
      badgeBg.lineStyle(2, 0xd97706, 1);
      badgeBg.strokeRoundedRect(-42, -12, 84, 24, 12);
      const badgeText = this.add.text(0, 0, '👑 Hoàn thành', {
        fontSize: '11px',
        fontStyle: 'bold',
        color: '#78350F',
      }).setOrigin(0.5);
      badgeContainer.add([badgeBg, badgeText]);
    } else if (status === 'in_progress') {
      badgeBg.fillStyle(0xe0f2fe, 1);
      badgeBg.fillRoundedRect(-42, -12, 84, 24, 12);
      badgeBg.lineStyle(2, 0x0284c7, 1);
      badgeBg.strokeRoundedRect(-42, -12, 84, 24, 12);
      const badgeText = this.add.text(0, 0, '⭐ Đang làm', {
        fontSize: '11px',
        fontStyle: 'bold',
        color: '#0369A1',
      }).setOrigin(0.5);
      badgeContainer.add([badgeBg, badgeText]);
    } else if (status === 'unlocked') {
      badgeBg.fillStyle(0xdcfce7, 1);
      badgeBg.fillRoundedRect(-38, -12, 76, 24, 12);
      badgeBg.lineStyle(2, 0x16a34a, 1);
      badgeBg.strokeRoundedRect(-38, -12, 76, 24, 12);
      const badgeText = this.add.text(0, 0, '✨ Mở khóa', {
        fontSize: '11px',
        fontStyle: 'bold',
        color: '#15803D',
      }).setOrigin(0.5);
      badgeContainer.add([badgeBg, badgeText]);
    } else {
      badgeBg.fillStyle(0xf1f5f9, 1);
      badgeBg.fillRoundedRect(-38, -12, 76, 24, 12);
      badgeBg.lineStyle(2, 0x64748b, 1);
      badgeBg.strokeRoundedRect(-38, -12, 76, 24, 12);
      const badgeText = this.add.text(0, 0, `🔒 ${zone.requiredStars} Sao`, {
        fontSize: '11px',
        fontStyle: 'bold',
        color: '#475569',
      }).setOrigin(0.5);
      badgeContainer.add([badgeBg, badgeText]);
    }
    container.add(badgeContainer);

    // E. TIÊU ĐỀ TÊN VÙNG ĐẤT
    const titleText = this.add.text(0, 56, `Vùng ${zoneNum}\n${zone.title}`, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#0F172A',
      align: 'center',
      stroke: '#FFFFFF',
      strokeThickness: 4,
    }).setOrigin(0.5, 0);
    container.add(titleText);

    // F. SỰ KIỆN TƯƠNG TÁC CHẠM
    container.setSize(120, 120);
    container.setInteractive({ useHandCursor: status !== 'locked' });

    container.on('pointerover', () => {
      if (status === 'locked') return;
      this.tweens.add({
        targets: container,
        scale: 1.12,
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
      this.handleZoneClick(x, y, zone);
    });
  }

  private createRonieToken(startX: number, startY: number): void {
    this.ronieSprite = this.add.container(startX, startY);

    // Bóng đổ dưới chân
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.3);
    shadow.fillEllipse(0, 32, 42, 16);
    this.ronieSprite.add(shadow);

    // Token hình tròn nhện nhí
    const body = this.add.graphics();
    body.fillStyle(0xe11d48, 1);
    body.fillCircle(0, 0, 26);
    body.lineStyle(3, 0xfde047, 1);
    body.strokeCircle(0, 0, 26);
    this.ronieSprite.add(body);

    const ronieIcon = this.add.text(0, -2, '🕷️', {
      fontSize: '26px',
    }).setOrigin(0.5);
    this.ronieSprite.add(ronieIcon);

    const nameLabel = this.add.text(0, -38, 'Ronie', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#FEF08A',
      stroke: '#9F1239',
      strokeThickness: 3,
    }).setOrigin(0.5);
    this.ronieSprite.add(nameLabel);

    // Nhún nhảy nhẹ vui vẻ
    this.tweens.add({
      targets: this.ronieSprite,
      y: startY - 8,
      duration: 650,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createFloatingPastelClouds(width: number, height: number): void {
    for (let i = 0; i < 5; i++) {
      const cloud = this.add.text(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(20, height * 0.4),
        '☁️',
        { fontSize: `${Phaser.Math.Between(35, 65)}px` }
      ).setAlpha(0.4);

      this.tweens.add({
        targets: cloud,
        x: width + 100,
        duration: Phaser.Math.Between(30000, 50000),
        repeat: -1,
        onRepeat: () => {
          cloud.x = -100;
          cloud.y = Phaser.Math.Between(20, height * 0.4);
        },
      });
    }
  }

  private handleZoneClick(targetX: number, targetY: number, zone: IZoneInfo): void {
    if (this.isMoving) return;

    if (zone.status === 'locked') {
      gameBridge.emit('AUDIO_PLAY_SFX', { sfxKey: 'try_again' });
      return;
    }

    this.isMoving = true;
    gameBridge.emit('AUDIO_PLAY_SFX', { sfxKey: 'tap' });

    // Ronie di chuyển đến vùng đất
    this.tweens.add({
      targets: this.ronieSprite,
      x: targetX,
      y: targetY - 35,
      duration: 600,
      ease: 'Power2',
      onComplete: () => {
        this.isMoving = false;
        // Mở màn hình Chọn Nhiệm Vụ (Mission Selection) của vùng này
        gameBridge.emit('ZONE_SELECTED', { zoneId: zone.id });
      },
    });
  }
}
