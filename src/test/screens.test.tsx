// src/test/screens.test.tsx
import React from 'react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SplashScreen } from '../features/splash/SplashScreen';
import { MainMenu } from '../features/main-menu/MainMenu';
import { RoyalCastle } from '../features/castle/RoyalCastle';
import { MissionSelection } from '../features/missions/MissionSelection';
import { ToyRoom } from '../features/toy-room/ToyRoom';
import { ProfileScreen } from '../features/profile/ProfileScreen';

describe('Giao Diện Các Màn Hình Phase 1 (UI & Navigation)', () => {
  it('render SplashScreen và nút BẮT ĐẦU hoạt động', () => {
    const handleStart = vi.fn();
    render(<SplashScreen onStart={handleStart} />);

    expect(screen.getAllByText(/RONIE/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/NHI MAMI/i).length).toBeGreaterThanOrEqual(1);

    const startBtn = screen.getByRole('button', { name: /BẮT ĐẦU PHIÊU LƯU!/i });
    expect(startBtn).toBeTruthy();

    fireEvent.click(startBtn);
    expect(handleStart).toHaveBeenCalledTimes(1);
  });

  it('render MainMenu với 5 nút lớn đầy đủ và kích hoạt sự kiện', () => {
    const onStartAdventure = vi.fn();
    const onOpenCastle = vi.fn();
    const onOpenToyRoom = vi.fn();
    const onOpenProfile = vi.fn();
    const onOpenMathCorner = vi.fn();
    const onOpenSettings = vi.fn();

    render(
      <MainMenu
        onStartAdventure={onStartAdventure}
        onOpenCastle={onOpenCastle}
        onOpenToyRoom={onOpenToyRoom}
        onOpenProfile={onOpenProfile}
        onOpenMathCorner={onOpenMathCorner}
        onOpenSettings={onOpenSettings}
        totalStars={15}
      />
    );

    expect(screen.getByText(/PHIÊU LƯU/i)).toBeTruthy();
    expect(screen.getByText(/PHÒNG ĐỒ CHƠI/i)).toBeTruthy();
    expect(screen.getByText(/HỒ SƠ RONIE/i)).toBeTruthy();
    expect(screen.getByText(/GÓC HỌC TOÁN/i)).toBeTruthy();
    expect(screen.getByText(/CÀI ĐẶT/i)).toBeTruthy();

    // Bấm nút Phiêu lưu
    fireEvent.click(screen.getByText(/PHIÊU LƯU/i));
    expect(onStartAdventure).toHaveBeenCalledTimes(1);

    // Bấm nút Lâu Đài Nữ Hoàng
    const castleBtn = screen.getByTitle(/Vào Lâu Đài Hoàng Gia/i);
    fireEvent.click(castleBtn);
    expect(onOpenCastle).toHaveBeenCalledTimes(1);
  });

  it('render RoyalCastle với ngai vàng, Nữ hoàng Nhi Mami và các tab', () => {
    const onBack = vi.fn();
    const onHome = vi.fn();
    const onSelectMission = vi.fn();
    const onOpenToyRoom = vi.fn();

    render(
      <RoyalCastle
        onBack={onBack}
        onHome={onHome}
        onSelectMission={onSelectMission}
        onOpenToyRoom={onOpenToyRoom}
        totalStars={15}
      />
    );

    expect(screen.getAllByText(/Lâu Đài Hoàng Gia/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Nữ Hoàng Nhi Mami/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Nhiệm Vụ Hoàng Gia/i)).toBeTruthy();
    expect(screen.getByText(/Khu Vực Trao Thưởng/i)).toBeTruthy();
  });

  it('render MissionSelection với các thẻ nhiệm vụ lớn và nút Bắt đầu', () => {
    const onBack = vi.fn();
    const onHome = vi.fn();
    const onStartMission = vi.fn();

    render(
      <MissionSelection
        zoneId={1}
        onBack={onBack}
        onHome={onHome}
        onStartMission={onStartMission}
        totalStars={12}
      />
    );

    expect(screen.getAllByText(/Rừng Số Kỳ Diệu/i).length).toBeGreaterThanOrEqual(1);
    const actionButtons = screen.getAllByRole('button', { name: /(BẮT ĐẦU NHIỆM VỤ|Chơi Lại Lấy 3 Sao)/i });
    expect(actionButtons.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(actionButtons[0]);
    expect(onStartMission).toHaveBeenCalledTimes(1);
  });

  it('render ToyRoom với các tab trang phục, đồ chơi, cúp vàng', () => {
    const onBack = vi.fn();
    const onHome = vi.fn();

    render(<ToyRoom onBack={onBack} onHome={onHome} totalStars={12} />);

    expect(screen.getAllByText(/Phòng Đồ Chơi Của Ronie/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Tủ Trang Phục/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Kệ Đồ Chơi/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Cúp & Huy Hiệu/i).length).toBeGreaterThanOrEqual(1);

    // Chuyển tab sang Kệ Đồ Chơi
    const toyTabBtn = screen.getAllByRole('button', { name: /Kệ Đồ Chơi/i })[0];
    fireEvent.click(toyTabBtn);
    expect(screen.getByText(/Gấu Bông Học Đếm/i)).toBeTruthy();
  });

  it('render ProfileScreen với cấp độ hiệp sĩ và thống kê thành tích', () => {
    const onBack = vi.fn();
    const onHome = vi.fn();

    render(<ProfileScreen onBack={onBack} onHome={onHome} totalStars={12} />);

    expect(screen.getAllByText(/Hồ Sơ Của Ronie/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/BÉ RONIE - LỚP 1/i)).toBeTruthy();
    expect(screen.getAllByText(/Sao Tri Thức/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Nhiệm Vụ Xong/i)).toBeTruthy();
    expect(screen.getByText(/Kỹ Năng Toán Học Thành Thạo/i)).toBeTruthy();
  });
});
