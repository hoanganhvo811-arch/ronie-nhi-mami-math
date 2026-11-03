// src/features/parent-dashboard/ParentDashboardModal.tsx
// Khu vực Quản lý Phụ Huynh & Phân Tích Năng Lực Học Tập Toàn Diện (Phase 7)

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  X,
  Clock,
  BarChart3,
  Download,
  Upload,
  Volume2,
  CheckCircle2,
  BookOpen,
  Sliders,
  Database,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Calendar,
  Layers,
  Award,
  Heart,
} from 'lucide-react';
import { soundManager } from '../../services/audio/AudioManager';
import { ParentGate } from './ParentGate';
import {
  DEFAULT_PROFILE_ID,
  getParentSettings,
  updateParentSettings,
  getMathSessions,
  getAllProgress,
  getProgression,
  exportBackupData,
  importBackupData,
  resetProfileData,
} from '../../services/storage/db';
import {
  AnalyticsEngine,
  TOPIC_META_MAP,
} from './analyticsEngine';
import { screenTimeTracker } from '../../services/time/ScreenTimeTracker';
import type { IParentSettings, MathTopicKey, ParentDifficulty } from '../../types/database';
import type {
  TimeframeFilter,
  IAnalyticsOverview,
  ITopicAnalytics,
  ILearningDiagnostics,
} from '../../types/analytics';

interface ParentDashboardModalProps {
  onClose: () => void;
}

type DashboardTab = 'overview' | 'diagnostics' | 'time' | 'content' | 'backup';

export const ParentDashboardModal: React.FC<ParentDashboardModalProps> = ({ onClose }) => {
  // Trạng thái mở khóa bảo mật phụ huynh
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [timeframe, setTimeframe] = useState<TimeframeFilter>('all_time');

  // Dữ liệu phân tích
  const [overview, setOverview] = useState<IAnalyticsOverview | null>(null);
  const [topicStats, setTopicStats] = useState<ITopicAnalytics[]>([]);
  const [diagnostics, setDiagnostics] = useState<ILearningDiagnostics | null>(null);
  const [parentSettings, setParentSettings] = useState<IParentSettings | null>(null);

  // Trạng thái thông báo thao tác
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [actionErrorMsg, setActionErrorMsg] = useState<string | null>(null);
  const [confirmRestoreJson, setConfirmRestoreJson] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tải dữ liệu phân tích từ IndexedDB
  const loadDashboardData = async () => {
    try {
      const [sessions, progressList, progression, settings] = await Promise.all([
        getMathSessions(DEFAULT_PROFILE_ID, timeframe),
        getAllProgress(DEFAULT_PROFILE_ID),
        getProgression(DEFAULT_PROFILE_ID),
        getParentSettings(DEFAULT_PROFILE_ID),
      ]);

      setParentSettings(settings);

      // Cập nhật cấu hình ScreenTimeTracker
      screenTimeTracker.setConfig({
        dailyLimitMinutes: settings.dailyLimitMinutes,
        isLimitEnabled: settings.isTimeLimitEnabled ?? true,
        breakReminderMinutes: settings.breakReminderMinutes ?? 15,
      });

      // Tính toán các chỉ số
      const ov = AnalyticsEngine.calculateOverview(sessions, progressList, progression);
      const topics = AnalyticsEngine.calculateTopicBreakdown(sessions);
      const diag = AnalyticsEngine.generatePositiveDiagnostics(topics, sessions);

      setOverview(ov);
      setTopicStats(topics);
      setDiagnostics(diag);
    } catch (err) {
      console.warn('Lỗi tải dữ liệu bảng điều khiển:', err);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      loadDashboardData();
    }
  }, [isUnlocked, timeframe]);

  // Cập nhật cài đặt giới hạn thời gian
  const handleUpdateDailyLimit = async (minutes: number) => {
    soundManager.playTap();
    await updateParentSettings(DEFAULT_PROFILE_ID, { dailyLimitMinutes: minutes });
    screenTimeTracker.setConfig({ dailyLimitMinutes: minutes });
    await loadDashboardData();
    showNotice('Đã lưu giới hạn thời gian chơi mỗi ngày!');
  };

  const handleToggleTimeLimit = async (enabled: boolean) => {
    soundManager.playTap();
    await updateParentSettings(DEFAULT_PROFILE_ID, { isTimeLimitEnabled: enabled });
    screenTimeTracker.setConfig({ isLimitEnabled: enabled });
    await loadDashboardData();
    showNotice(enabled ? 'Đã kích hoạt giới hạn thời gian.' : 'Đã tắt giới hạn thời gian.');
  };

  // Cập nhật chủ đề nội dung học tập
  const handleToggleTopic = async (topicKey: MathTopicKey) => {
    soundManager.playTap();
    if (!parentSettings?.contentConfig) return;

    const currentTopics = parentSettings.contentConfig.enabledTopics || [];
    let updatedTopics: MathTopicKey[];

    if (currentTopics.includes(topicKey)) {
      if (currentTopics.length <= 1) {
        setActionErrorMsg('Phải có ít nhất 1 chủ đề học tập được kích hoạt!');
        return;
      }
      updatedTopics = currentTopics.filter((t) => t !== topicKey);
    } else {
      updatedTopics = [...currentTopics, topicKey];
    }

    await updateParentSettings(DEFAULT_PROFILE_ID, {
      contentConfig: {
        ...parentSettings.contentConfig,
        enabledTopics: updatedTopics,
      },
    });
    await loadDashboardData();
    showNotice('Đã cập nhật danh sách chủ đề học tập!');
  };

  // Cập nhật độ khó
  const handleUpdateDifficulty = async (difficulty: ParentDifficulty) => {
    soundManager.playTap();
    if (!parentSettings?.contentConfig) return;

    await updateParentSettings(DEFAULT_PROFILE_ID, {
      contentConfig: {
        ...parentSettings.contentConfig,
        difficulty,
      },
    });
    await loadDashboardData();
    showNotice(`Đã chuyển độ khó học tập sang: ${difficulty.toUpperCase()}`);
  };

  // Cập nhật số câu mỗi nhiệm vụ
  const handleUpdateQuestionCount = async (count: number) => {
    soundManager.playTap();
    if (!parentSettings?.contentConfig) return;

    await updateParentSettings(DEFAULT_PROFILE_ID, {
      contentConfig: {
        ...parentSettings.contentConfig,
        questionsPerMission: count,
      },
    });
    await loadDashboardData();
    showNotice(`Đã thiết lập ${count} câu hỏi cho mỗi nhiệm vụ.`);
  };

  // Xuất file sao lưu JSON
  const handleExportBackup = async () => {
    soundManager.playTap();
    try {
      const jsonString = await exportBackupData(DEFAULT_PROFILE_ID);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ronie_toan_lop1_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showNotice('Đã xuất file sao lưu JSON thành công!');
    } catch {
      setActionErrorMsg('Không thể xuất file sao lưu. Vui lòng thử lại!');
    }
  };

  // Chọn file khôi phục từ máy
  const handleSelectRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setConfirmRestoreJson(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Thực hiện ghi đè khôi phục dữ liệu
  const handleConfirmRestore = async () => {
    if (!confirmRestoreJson) return;
    soundManager.playTap();
    const result = await importBackupData(confirmRestoreJson, DEFAULT_PROFILE_ID);
    setConfirmRestoreJson(null);

    if (result.success) {
      await loadDashboardData();
      showNotice(result.message);
    } else {
      setActionErrorMsg(result.message);
    }
  };

  // Đặt lại dữ liệu gốc
  const handleConfirmReset = async () => {
    soundManager.playTap();
    await resetProfileData(DEFAULT_PROFILE_ID);
    setConfirmReset(false);
    await loadDashboardData();
    showNotice('Đã đưa toàn bộ dữ liệu học tập về trạng thái ban đầu.');
  };

  const showNotice = (msg: string) => {
    setActionSuccessMsg(msg);
    setActionErrorMsg(null);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl border-4 border-indigo-400 p-4 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        {/* NÚT ĐÓNG */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 rounded-xl transition-all cursor-pointer z-20"
          title="Đóng Bảng điều khiển"
        >
          <X className="w-5 h-5" />
        </button>

        {/* NẾU CHƯA QUA CỔNG XÁC THỰC NGƯỜI LỚN */}
        {!isUnlocked ? (
          <ParentGate
            onUnlock={() => setIsUnlocked(true)}
            onCancel={onClose}
          />
        ) : (
          /* BẢNG ĐIỀU KHIỂN ĐÃ MỞ KHÓA */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* 1. HEADER BẢNG ĐIỀU KHIỂN */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0 pr-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-md">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-comic font-black text-amber-300">
                    BẢNG THEO DÕI HỌC TẬP TOÁN LỚP 1
                  </h3>
                  <p className="text-[11px] font-comic font-bold text-slate-400">
                    Đồng hành cùng bé Ronie chuẩn chương trình GDPT 2018 (Offline-First)
                  </p>
                </div>
              </div>
            </div>

            {/* 2. THANH CHUYỂN TABS */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 my-1 border-b border-slate-800 scrollbar-none shrink-0">
              {[
                { id: 'overview', label: 'Tổng Quan', icon: BarChart3 },
                { id: 'diagnostics', label: 'Năng Lực & Nhận Định', icon: Sparkles },
                { id: 'time', label: 'Quản Lý Thời Gian', icon: Clock },
                { id: 'content', label: 'Nội Dung & Độ Khó', icon: Sliders },
                { id: 'backup', label: 'Sao Lưu & Dữ Liệu', icon: Database },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      soundManager.playTap();
                      setActiveTab(tab.id as DashboardTab);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-comic font-black flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* THÔNG BÁO PHẢN HỒI */}
            {actionSuccessMsg && (
              <div className="my-2 p-2.5 bg-emerald-950/80 border border-emerald-500 rounded-xl text-xs font-comic font-bold text-emerald-300 flex items-center gap-2 animate-fadeIn shrink-0">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{actionSuccessMsg}</span>
              </div>
            )}
            {actionErrorMsg && (
              <div className="my-2 p-2.5 bg-rose-950/80 border border-rose-500 rounded-xl text-xs font-comic font-bold text-rose-300 flex items-center gap-2 animate-shake shrink-0">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{actionErrorMsg}</span>
              </div>
            )}

            {/* 3. NỘI DUNG TỪNG TAB */}
            <div className="flex-1 overflow-y-auto pr-1 py-2">
              {/* TAB 1: TỔNG QUAN (OVERVIEW) */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {/* BỘ LỌC THỜI GIAN */}
                  <div className="flex items-center justify-between bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700">
                    <span className="text-xs font-comic font-bold text-slate-300 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      Lọc theo mốc thời gian:
                    </span>
                    <div className="flex gap-1">
                      {[
                        { id: 'today', label: 'Hôm nay' },
                        { id: '7_days', label: '7 ngày qua' },
                        { id: '30_days', label: '30 ngày' },
                        { id: 'all_time', label: 'Tất cả' },
                      ].map((tf) => (
                        <button
                          key={tf.id}
                          type="button"
                          onClick={() => {
                            soundManager.playTap();
                            setTimeframe(tf.id as TimeframeFilter);
                          }}
                          className={`px-2.5 py-1 rounded-xl text-xs font-comic font-bold transition-all cursor-pointer ${
                            timeframe === tf.id
                              ? 'bg-amber-400 text-slate-950 shadow font-black'
                              : 'bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          {tf.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* THẺ CHỈ SỐ TỔNG QUAN (KEY METRICS CARDS) */}
                  {overview && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 flex flex-col justify-between">
                        <span className="text-[11px] font-comic font-bold text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-sky-400" /> Thời gian học
                        </span>
                        <div className="text-xl sm:text-2xl font-comic font-black text-white mt-1">
                          {overview.totalPlaytimeMinutes} <span className="text-xs font-bold text-slate-400">phút</span>
                        </div>
                      </div>

                      <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 flex flex-col justify-between">
                        <span className="text-[11px] font-comic font-bold text-slate-400 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-400" /> Nhiệm vụ hoàn thành
                        </span>
                        <div className="text-xl sm:text-2xl font-comic font-black text-amber-300 mt-1">
                          {overview.totalMissionsCompleted} <span className="text-xs font-bold text-slate-400">màn</span>
                        </div>
                      </div>

                      <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 flex flex-col justify-between">
                        <span className="text-[11px] font-comic font-bold text-slate-400 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Tổng số câu hỏi
                        </span>
                        <div className="text-xl sm:text-2xl font-comic font-black text-emerald-400 mt-1">
                          {overview.totalQuestionsAnswered} <span className="text-xs font-bold text-slate-400">câu</span>
                        </div>
                      </div>

                      <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 flex flex-col justify-between">
                        <span className="text-[11px] font-comic font-bold text-slate-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Số câu đúng
                        </span>
                        <div className="text-xl sm:text-2xl font-comic font-black text-teal-300 mt-1">
                          {overview.totalCorrectAnswers} / {overview.totalQuestionsAnswered}
                        </div>
                      </div>

                      <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 flex flex-col justify-between">
                        <span className="text-[11px] font-comic font-bold text-slate-400 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-pink-400" /> Tỷ lệ chính xác
                        </span>
                        <div className="text-xl sm:text-2xl font-comic font-black text-pink-400 mt-1">
                          {overview.accuracyPercentage}%
                        </div>
                      </div>

                      <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 flex flex-col justify-between">
                        <span className="text-[11px] font-comic font-bold text-slate-400 flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-purple-400" /> Tiến độ chuẩn GDPT
                        </span>
                        <div className="text-xl sm:text-2xl font-comic font-black text-purple-300 mt-1">
                          {overview.curriculumProgressPercentage}%
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DANH SÁCH CHI TIẾT CÁC MẠCH CHỦ ĐỀ TOÁN HỌC */}
                  <div className="mt-4">
                    <h4 className="text-xs font-comic font-black text-cyan-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4" />
                      Mức Độ Thành Thạo 10 Mạch Chủ Đề Toán Lớp 1
                    </h4>

                    <div className="space-y-2">
                      {topicStats.map((topic) => (
                        <div
                          key={topic.topicKey}
                          className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 flex flex-col gap-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-comic font-bold text-slate-200">
                              {TOPIC_META_MAP[topic.topicKey]?.icon} {topic.topicName}
                            </span>
                            <span className="font-comic font-black text-amber-300">
                              {topic.totalQuestions > 0 ? `${topic.accuracy}%` : 'Chưa làm'}
                            </span>
                          </div>

                          {/* THANH TIẾN ĐỘ TỶ LỆ ĐÚNG */}
                          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                topic.accuracy >= 80
                                  ? 'bg-emerald-500'
                                  : topic.accuracy >= 60
                                  ? 'bg-amber-500'
                                  : topic.totalQuestions === 0
                                  ? 'bg-slate-700'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${topic.totalQuestions > 0 ? topic.accuracy : 0}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-comic">
                            <span>Đã làm: {topic.totalQuestions} câu ({topic.correctQuestions} đúng)</span>
                            <span>Thời gian TB: {topic.avgDurationSeconds}s/câu</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: NĂNG LỰC & NHẬN ĐỊNH SƯ PHẠM (DIAGNOSTICS) */}
              {activeTab === 'diagnostics' && diagnostics && (
                <div className="space-y-4">
                  {/* KHỐI 1: THẾ MẠNH CỦA BÉ */}
                  <div className="bg-gradient-to-br from-emerald-950/60 to-slate-800 p-4 rounded-2xl border border-emerald-500/50">
                    <h4 className="text-sm font-comic font-black text-emerald-400 mb-2 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                      🌟 Những Điểm Mạnh Nổi Trội Của Bé
                    </h4>
                    <ul className="space-y-2">
                      {diagnostics.strengths.map((str, idx) => (
                        <li key={idx} className="text-xs font-comic font-bold text-slate-200 flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">✓</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* KHỐI 2: ĐANG RÈN LUYỆN THÊM (KHÔNG TIÊU CỰC) */}
                  <div className="bg-gradient-to-br from-amber-950/60 to-slate-800 p-4 rounded-2xl border border-amber-500/50">
                    <h4 className="text-sm font-comic font-black text-amber-300 mb-2 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-amber-400" />
                      🌱 Chủ Đề Bé Đang Luyện Tập Thêm
                    </h4>
                    <ul className="space-y-2">
                      {diagnostics.needsPractice.map((np, idx) => (
                        <li key={idx} className="text-xs font-comic font-bold text-slate-200 flex items-start gap-2">
                          <span className="text-amber-400 mt-0.5">★</span>
                          <span>{np}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* KHỐI 3: PHẢN XẠ & THÓI QUEN SỬ DỤNG GỢI Ý */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
                      <h5 className="text-xs font-comic font-black text-cyan-300 mb-1 flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> Tốc Độ Phản Xạ
                      </h5>
                      <div className="text-lg font-comic font-black text-white mb-1">
                        {diagnostics.avgResponseSpeed} giây / câu
                      </div>
                      <p className="text-[11px] font-comic font-bold text-slate-300 leading-relaxed">
                        {diagnostics.speedFeedback}
                      </p>
                    </div>

                    <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
                      <h5 className="text-xs font-comic font-black text-purple-300 mb-1 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" /> Sử Dụng Gợi Ý Sư Phạm
                      </h5>
                      <p className="text-xs font-comic font-bold text-slate-200 mt-1 leading-relaxed">
                        {diagnostics.hintTendency}
                      </p>
                    </div>
                  </div>

                  {/* KHỐI 4: XU HƯỚNG TIẾN BỘ */}
                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-indigo-500/40">
                    <h5 className="text-xs font-comic font-black text-indigo-300 mb-1 flex items-center gap-1.5">
                      <Award className="w-4 h-4" /> Xu Hướng Phát Triển Toàn Diện
                    </h5>
                    <p className="text-xs font-comic font-bold text-slate-200 leading-relaxed">
                      {diagnostics.progressTrend}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: QUẢN LÝ THỜI GIAN & SỨC KHỎE (SCREEN TIME) */}
              {activeTab === 'time' && (
                <div className="space-y-4">
                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-comic font-black text-amber-300 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-amber-400" />
                          Giới Hạn Thời Gian Chơi Mỗi Ngày
                        </h4>
                        <p className="text-[11px] font-comic text-slate-400">
                          Bảo vệ thị lực và cân bằng hoạt động thể chất cho trẻ 6-7 tuổi
                        </p>
                      </div>

                      {/* NÚT BẬT/TẮT GIỚI HẠN */}
                      <button
                        type="button"
                        onClick={() => handleToggleTimeLimit(!(parentSettings?.isTimeLimitEnabled ?? true))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-comic font-black transition-all cursor-pointer ${
                          parentSettings?.isTimeLimitEnabled ?? true
                            ? 'bg-emerald-600 text-white shadow'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {parentSettings?.isTimeLimitEnabled ?? true ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
                      </button>
                    </div>

                    {/* LỰA CHỌN MỐC THỜI GIAN (PHÚT) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                      {[15, 20, 30, 45].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => handleUpdateDailyLimit(mins)}
                          className={`py-3 rounded-2xl text-xs font-comic font-black transition-all cursor-pointer ${
                            parentSettings?.dailyLimitMinutes === mins
                              ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                          }`}
                        >
                          {mins} phút / ngày
                        </button>
                      ))}
                    </div>

                    {/* THỜI GIAN ĐÃ SỬ DỤNG HÔM NAY */}
                    <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-comic">
                      <span className="text-slate-400">Thời gian bé đã chơi hôm nay:</span>
                      <span className="font-black text-amber-300">
                        {screenTimeTracker.getTodayPlayedMinutes()} phút
                      </span>
                    </div>

                    <p className="text-[11px] font-comic text-slate-400 mt-2">
                      * <strong>Nguyên tắc dịu dàng:</strong> Khi hết giờ, trò chơi sẽ chờ bé hoàn thành màn hiện tại rồi nhẹ nhàng đưa về Lâu đài nghỉ ngơi, tuyệt đối không khóa gián đoạn giữa chừng.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: QUẢN LÝ NỘI DUNG & ĐỘ KHÓ (CONTENT) */}
              {activeTab === 'content' && parentSettings && (
                <div className="space-y-4">
                  {/* CHỌN ĐỘ KHÓ */}
                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                    <h4 className="text-sm font-comic font-black text-indigo-300 mb-2 flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-indigo-400" />
                      Mức Độ Thử Thách
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'easy', label: 'Dễ Dàng', desc: 'Nhiều gợi ý, số nhỏ' },
                        { id: 'standard', label: 'Tiêu Chuẩn', desc: 'Chuẩn GDPT 2018' },
                        { id: 'challenge', label: 'Thử Thách', desc: 'Nhiều bài toán đố' },
                      ].map((lvl) => (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => handleUpdateDifficulty(lvl.id as ParentDifficulty)}
                          className={`p-3 rounded-2xl text-left transition-all cursor-pointer ${
                            parentSettings.contentConfig?.difficulty === lvl.id
                              ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-comic font-black">{lvl.label}</div>
                          <div className="text-[10px] font-comic opacity-80">{lvl.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SỐ CÂU HỎI MỖI NHIỆM VỤ */}
                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                    <h4 className="text-sm font-comic font-black text-amber-300 mb-2">
                      Số Câu Hỏi Trong Mỗi Nhiệm Vụ
                    </h4>
                    <div className="flex gap-2">
                      {[3, 5, 8, 10].map((cnt) => (
                        <button
                          key={cnt}
                          type="button"
                          onClick={() => handleUpdateQuestionCount(cnt)}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-comic font-black transition-all cursor-pointer ${
                            parentSettings.contentConfig?.questionsPerMission === cnt
                              ? 'bg-amber-400 text-slate-950 shadow'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
                          }`}
                        >
                          {cnt} câu
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* BẬT / TẮT CHỦ ĐỀ HỌC TẬP */}
                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                    <h4 className="text-sm font-comic font-black text-cyan-300 mb-2">
                      Lựa Chọn Mạch Kiến Thức Đang Bật
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(Object.keys(TOPIC_META_MAP) as MathTopicKey[]).map((topicKey) => {
                        const meta = TOPIC_META_MAP[topicKey];
                        const isEnabled = parentSettings.contentConfig?.enabledTopics.includes(topicKey);

                        return (
                          <button
                            key={topicKey}
                            type="button"
                            onClick={() => handleToggleTopic(topicKey)}
                            className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs font-comic font-bold transition-all cursor-pointer ${
                              isEnabled
                                ? 'bg-indigo-950/60 border-indigo-500 text-white'
                                : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <span>
                              {meta.icon} {meta.name}
                            </span>
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-800">
                              {isEnabled ? 'BẬT' : 'TẮT'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SAO LƯU & PHỤC HỒI (BACKUP & RESTORE) */}
              {activeTab === 'backup' && (
                <div className="space-y-4">
                  {/* XUẤT SAO LƯU */}
                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-comic font-black text-white flex items-center gap-1.5">
                        <Download className="w-4 h-4 text-indigo-400" />
                        Sao Lưu Dữ Liệu Học Tập (Export JSON)
                      </h4>
                      <p className="text-[11px] font-comic text-slate-400">
                        Tải file JSON lưu giữ toàn bộ tiến trình, kho đồ, huy hiệu và lịch sử làm bài
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportBackup}
                      className="w-full sm:w-auto py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-comic font-black text-xs rounded-xl shadow transition-all cursor-pointer whitespace-nowrap"
                    >
                      Tải File Sao Lưu
                    </button>
                  </div>

                  {/* NHẬP KHÔI PHỤC */}
                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-comic font-black text-white flex items-center gap-1.5">
                        <Upload className="w-4 h-4 text-emerald-400" />
                        Khôi Phục Tiến Trình (Import JSON)
                      </h4>
                      <p className="text-[11px] font-comic text-slate-400">
                        Nạp lại dữ liệu từ file sao lưu đã lưu trước đó trên máy
                      </p>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={handleSelectRestoreFile}
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-comic font-black text-xs rounded-xl shadow transition-all cursor-pointer whitespace-nowrap"
                    >
                      Chọn File Khôi Phục
                    </button>
                  </div>

                  {/* ĐẶT LẠI DỮ LIỆU BAN ĐẦU */}
                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-rose-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-comic font-black text-rose-400 flex items-center gap-1.5">
                        <RotateCcw className="w-4 h-4 text-rose-500" />
                        Đặt Lại Về Trạng Thái Ban Đầu
                      </h4>
                      <p className="text-[11px] font-comic text-slate-400">
                        Xóa lịch sử làm bài và mở lại từ Vùng 1 (Không ảnh hưởng đến tài khoản máy)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(true)}
                      className="w-full sm:w-auto py-2.5 px-4 bg-rose-600/80 hover:bg-rose-600 active:scale-95 text-white font-comic font-black text-xs rounded-xl shadow transition-all cursor-pointer whitespace-nowrap"
                    >
                      Đặt Lại Dữ Liệu
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL XÁC NHẬN GHI ĐÈ KHI IMPORT BACKUP */}
        {confirmRestoreJson && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-slate-900 p-6 rounded-3xl border-3 border-amber-400 max-w-md w-full text-center space-y-4">
              <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
              <h4 className="text-lg font-comic font-black text-white">Xác Nhận Khôi Phục Dữ Liệu?</h4>
              <p className="text-xs font-comic text-slate-300 leading-relaxed">
                Tiến trình học tập và kho đồ hiện tại sẽ được thay thế bằng dữ liệu từ file sao lưu. Thao tác này không thể hoàn tác.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmRestoreJson(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-comic font-bold text-xs rounded-xl cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRestore}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-comic font-black text-xs rounded-xl cursor-pointer"
                >
                  Xác Nhận Ghi Đè
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL XÁC NHẬN RESET DỮ LIỆU */}
        {confirmReset && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-slate-900 p-6 rounded-3xl border-3 border-rose-500 max-w-md w-full text-center space-y-4">
              <RotateCcw className="w-12 h-12 text-rose-500 mx-auto" />
              <h4 className="text-lg font-comic font-black text-white">Đặt Lại Toàn Bộ Tiến Trình?</h4>
              <p className="text-xs font-comic text-slate-300 leading-relaxed">
                Bé sẽ bắt đầu lại từ Vùng 1 Màn 1 như khi mới cài game. Bạn có chắc chắn muốn đặt lại không?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-comic font-bold text-xs rounded-xl cursor-pointer"
                >
                  Không, giữ lại
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-comic font-black text-xs rounded-xl cursor-pointer"
                >
                  Đồng Ý Đặt Lại
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
