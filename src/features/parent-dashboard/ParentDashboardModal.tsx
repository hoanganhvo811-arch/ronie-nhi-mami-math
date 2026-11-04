// src/features/parent-dashboard/ParentDashboardModal.tsx
// Khu vực Quản lý Phụ Huynh & Báo Cáo Phân Tích Năng Lực Học Tập (Phase 6)

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  X,
  Clock,
  BarChart3,
  Download,
  Upload,
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
  TrendingUp,
  Compass,
  History,
  ArrowUpRight,
  ArrowRight,
  Check,
  Timer,
  Zap,
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
  PHASE6_TOPICS_META,
} from './analyticsEngine';
import { screenTimeTracker } from '../../services/time/ScreenTimeTracker';
import type { IParentSettings } from '../../types/database';
import type {
  TimeframeFilter,
  IAnalyticsOverview,
  Phase6TopicKey,
  ITopicAnalyticsPhase6,
  ISmartLearningRecommendation,
  IParentLearningHistoryItem,
} from '../../types/analytics';

interface ParentDashboardModalProps {
  onClose: () => void;
}

type DashboardTab =
  | 'overview'
  | 'topics'
  | 'recommendations'
  | 'settings'
  | 'history'
  | 'backup';

export const ParentDashboardModal: React.FC<ParentDashboardModalProps> = ({ onClose }) => {
  // Trạng thái mở khóa bảo mật phụ huynh
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [timeframe, setTimeframe] = useState<TimeframeFilter>('all_time');

  // Dữ liệu phân tích thực tế từ DB
  const [overview, setOverview] = useState<IAnalyticsOverview | null>(null);
  const [topicStatsPhase6, setTopicStatsPhase6] = useState<ITopicAnalyticsPhase6[]>([]);
  const [recommendationsData, setRecommendationsData] = useState<{
    strengths: string[];
    needsPractice: string[];
    recommendations: ISmartLearningRecommendation[];
    summary: string;
  } | null>(null);
  const [learningHistory, setLearningHistory] = useState<IParentLearningHistoryItem[]>([]);
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

      // Tính toán các chỉ số thực tế
      const ov = AnalyticsEngine.calculateOverview(sessions, progressList, progression);
      const topics6 = AnalyticsEngine.calculateTopicBreakdownPhase6(sessions);
      const recs = AnalyticsEngine.generateSmartRecommendations(topics6, sessions);
      const history = AnalyticsEngine.formatLearningHistory(sessions);

      setOverview(ov);
      setTopicStatsPhase6(topics6);
      setRecommendationsData(recs);
      setLearningHistory(history);
    } catch (err) {
      console.warn('Lỗi tải dữ liệu bảng điều khiển phụ huynh:', err);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      loadDashboardData();
    }
  }, [isUnlocked, timeframe]);

  // Thông báo phản hồi
  const showNotice = (msg: string) => {
    setActionSuccessMsg(msg);
    setActionErrorMsg(null);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  // Cập nhật cài đặt giới hạn thời gian chơi mỗi ngày
  const handleUpdateDailyLimit = async (minutes: number) => {
    soundManager.playTap();
    await updateParentSettings(DEFAULT_PROFILE_ID, { dailyLimitMinutes: minutes });
    screenTimeTracker.setConfig({ dailyLimitMinutes: minutes });
    await loadDashboardData();
    showNotice(`Đã thiết lập thời lượng chơi: ${minutes === 0 ? 'Không giới hạn' : `${minutes} phút/ngày`}`);
  };

  // Bật/tắt giới hạn thời gian
  const handleToggleTimeLimit = async (enabled: boolean) => {
    soundManager.playTap();
    await updateParentSettings(DEFAULT_PROFILE_ID, { isTimeLimitEnabled: enabled });
    screenTimeTracker.setConfig({ isLimitEnabled: enabled });
    await loadDashboardData();
    showNotice(enabled ? 'Đã bật giới hạn thời gian chơi.' : 'Đã tắt giới hạn thời gian chơi.');
  };

  // Cập nhật giới hạn mỗi phiên
  const handleUpdateSessionLimit = async (minutes: number) => {
    soundManager.playTap();
    await updateParentSettings(DEFAULT_PROFILE_ID, {
      sessionLimitMinutes: minutes,
      breakReminderMinutes: minutes,
    });
    await loadDashboardData();
    showNotice(`Đã thiết lập giới hạn mỗi phiên: ${minutes} phút (nhắc nghỉ ngơi).`);
  };

  // Bật/tắt câu hỏi nâng cao (Level 4 - 5)
  const handleToggleAdvancedQuestions = async (enabled: boolean) => {
    soundManager.playTap();
    await updateParentSettings(DEFAULT_PROFILE_ID, {
      enableAdvancedQuestions: enabled,
      contentConfig: {
        ...(parentSettings?.contentConfig || {
          enabledTopics: Object.keys(PHASE6_TOPICS_META),
          questionsPerMission: 5,
          difficulty: 'standard',
          maxMistakesAllowed: 3,
        }),
        enableAdvancedQuestions: enabled,
      },
    });
    await loadDashboardData();
    showNotice(enabled ? 'Đã bật chế độ câu hỏi nâng cao (Cấp 4-5).' : 'Đã chuyển sang câu hỏi vừa sức.');
  };

  // Bật/tắt thử thách thời gian (Timed Challenge)
  const handleToggleTimedChallenges = async (enabled: boolean) => {
    soundManager.playTap();
    await updateParentSettings(DEFAULT_PROFILE_ID, {
      enableTimedChallenges: enabled,
      contentConfig: {
        ...(parentSettings?.contentConfig || {
          enabledTopics: Object.keys(PHASE6_TOPICS_META),
          questionsPerMission: 5,
          difficulty: 'standard',
          maxMistakesAllowed: 3,
        }),
        enableTimedChallenges: enabled,
      },
    });
    await loadDashboardData();
    showNotice(enabled ? 'Đã bật đồng hồ thử thách thời gian.' : 'Đã tắt tính giờ (chế độ không áp lực).');
  };

  // Bật/tắt chủ đề toán học
  const handleToggleTopic = async (topicKey: Phase6TopicKey) => {
    soundManager.playTap();
    const currentTopics = (parentSettings?.contentConfig?.enabledTopics as string[]) || Object.keys(PHASE6_TOPICS_META);
    let updatedTopics: string[];

    if (currentTopics.includes(topicKey)) {
      if (currentTopics.length <= 1) {
        setActionErrorMsg('Phải giữ lại ít nhất 1 chủ đề toán học đang bật!');
        return;
      }
      updatedTopics = currentTopics.filter((t) => t !== topicKey);
    } else {
      updatedTopics = [...currentTopics, topicKey];
    }

    await updateParentSettings(DEFAULT_PROFILE_ID, {
      contentConfig: {
        ...(parentSettings?.contentConfig || {
          questionsPerMission: 5,
          difficulty: 'standard',
          maxMistakesAllowed: 3,
        }),
        enabledTopics: updatedTopics,
      },
    });
    await loadDashboardData();
    showNotice(`Đã cập nhật phạm vi học tập: ${PHASE6_TOPICS_META[topicKey].name}`);
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
      a.download = `ronie_nhi_mami_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showNotice('Đã xuất file sao lưu thành công!');
    } catch {
      setActionErrorMsg('Lỗi xuất dữ liệu sao lưu.');
    }
  };

  // Chọn file sao lưu để nạp lại
  const handleSelectRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setConfirmRestoreJson(content);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Xác nhận khôi phục
  const handleConfirmRestore = async () => {
    if (!confirmRestoreJson) return;
    soundManager.playTap();
    const result = await importBackupData(confirmRestoreJson);
    setConfirmRestoreJson(null);

    if (result.success) {
      await loadDashboardData();
      showNotice(result.message);
    } else {
      setActionErrorMsg(result.message);
    }
  };

  // Đặt lại dữ liệu học tập
  const handleConfirmReset = async () => {
    soundManager.playTap();
    await resetProfileData(DEFAULT_PROFILE_ID);
    setConfirmReset(false);
    await loadDashboardData();
    showNotice('Đã đặt lại toàn bộ dữ liệu học tập về ban đầu.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl border-4 border-indigo-400 p-4 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        {/* NÚT ĐÓNG */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 rounded-xl transition-all cursor-pointer z-20"
          title="Đóng Bảng Điều Khiển"
        >
          <X className="w-5 h-5" />
        </button>

        {/* NẾU CHƯA QUA CỔNG XÁC THỰC NGƯỜI LỚN */}
        {!isUnlocked ? (
          <ParentGate
            onUnlock={() => setIsUnlocked(true)}
            onCancel={onClose}
            pinCode={parentSettings?.pinCode || '2018'}
          />
        ) : (
          /* BẢNG ĐIỀU KHIỂN ĐÃ MỞ KHÓA */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* 1. HEADER BẢNG ĐIỀU KHIỂN */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0 pr-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-md">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-comic font-black text-amber-300">
                    BẢNG THEO DÕI HỌC TẬP TOÁN LỚP 1
                  </h3>
                  <p className="text-[11px] font-comic font-bold text-slate-400">
                    Đồng hành cùng bé Ronie chuẩn chương trình GDPT 2018 • Báo cáo số liệu thực tế
                  </p>
                </div>
              </div>
            </div>

            {/* 2. THANH CHUYỂN TABS */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 my-1 border-b border-slate-800 scrollbar-none shrink-0">
              {[
                { id: 'overview', label: 'Tổng Quan', icon: BarChart3 },
                { id: 'topics', label: '8 Chủ Đề Toán', icon: Sparkles },
                { id: 'recommendations', label: 'Đề Xuất Luyện Tập', icon: Compass },
                { id: 'settings', label: 'Thiết Lập Phụ Huynh', icon: Sliders },
                { id: 'history', label: 'Lịch Sử Học Tập', icon: History },
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
              {/* ============================================================== */}
              {/* TAB 1: TỔNG QUAN (OVERVIEW) */}
              {/* ============================================================== */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {/* BỘ LỌC THỜI GIAN */}
                  <div className="flex items-center justify-between bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700">
                    <span className="text-xs font-comic font-bold text-slate-300 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      Mốc thời gian thống kê:
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

                  {/* 6 THẺ SỐ LIỆU TỔNG QUAN (THỰC TẾ 100%) */}
                  {overview && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {/* 1. Tổng thời gian học */}
                      <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 flex flex-col justify-between">
                        <span className="text-[11px] font-comic font-bold text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-sky-400" /> Tổng thời gian học
                        </span>
                        <div className="text-xl sm:text-2xl font-comic font-black text-white mt-1">
                          {overview.totalPlaytimeMinutes}{' '}
                          <span className="text-xs font-bold text-slate-400">phút</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-comic">
                          Tích lũy từ các buổi học
                        </span>
                      </div>

                      {/* 2. Số nhiệm vụ hoàn thành */}
                      <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 flex flex-col justify-between">
                        <span className="text-[11px] font-comic font-bold text-slate-400 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-400" /> Nhiệm vụ hoàn thành
                        </span>
                        <div className="text-xl sm:text-2xl font-comic font-black text-amber-300 mt-1">
                          {overview.totalMissionsCompleted}{' '}
                          <span className="text-xs font-bold text-slate-400">nhiệm vụ</span>
                        </div>
                        <span className="text-[10px] text-amber-400/80 font-comic">
                          Tiến độ: {overview.curriculumProgressPercentage}%
                        </span>
                      </div>

                      {/* 3. Tổng số câu hỏi */}
                      <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 flex flex-col justify-between">
                        <span className="text-[11px] font-comic font-bold text-slate-400 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Tổng số câu hỏi
                        </span>
                        <div className="text-xl sm:text-2xl font-comic font-black text-emerald-400 mt-1">
                          {overview.totalQuestionsAnswered}{' '}
                          <span className="text-xs font-bold text-slate-400">câu đã giải</span>
                        </div>
                        <span className="text-[10px] text-emerald-400/80 font-comic">
                          {overview.totalCorrectAnswers} câu chính xác
                        </span>
                      </div>

                      {/* 4. Tỷ lệ trả lời đúng */}
                      <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 flex flex-col justify-between">
                        <span className="text-[11px] font-comic font-bold text-slate-400 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-pink-400" /> Tỷ lệ trả lời đúng
                        </span>
                        <div className="text-xl sm:text-2xl font-comic font-black text-pink-400 mt-1">
                          {overview.accuracyPercentage}%
                        </div>
                        <span className="text-[10px] text-slate-500 font-comic">
                          {overview.accuracyPercentage >= 80 ? 'Rất thành thạo' : overview.accuracyPercentage >= 60 ? 'Đang tiến bộ đều' : 'Cần thêm thời gian'}
                        </span>
                      </div>

                      {/* 5. Số chủ đề đã thành thạo */}
                      <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 flex flex-col justify-between">
                        <span className="text-[11px] font-comic font-bold text-slate-400 flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-cyan-400" /> Chủ đề thành thạo
                        </span>
                        <div className="text-xl sm:text-2xl font-comic font-black text-cyan-300 mt-1">
                          {overview.masteredTopicsCount ?? 0} / 8{' '}
                          <span className="text-xs font-bold text-slate-400">chủ đề</span>
                        </div>
                        <span className="text-[10px] text-cyan-400/80 font-comic">
                          Chuẩn 8 mạch kiến thức GDPT
                        </span>
                      </div>

                      {/* 6. Tiến bộ theo thời gian */}
                      <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 flex flex-col justify-between">
                        <span className="text-[11px] font-comic font-bold text-slate-400 flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-purple-400" /> Tiến bộ theo thời gian
                        </span>
                        <div className="text-xs font-comic font-black text-purple-200 mt-1 leading-snug">
                          {overview.progressOverTimeTrend || 'Phong độ làm bài ổn định'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* THÔNG ĐIỆP SƯ PHẠM ẤM ÁP */}
                  <div className="bg-gradient-to-r from-indigo-950/70 to-purple-950/70 p-4 rounded-2xl border border-indigo-500/40 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-amber-300 shrink-0 text-xl">
                      👑
                    </div>
                    <div>
                      <h4 className="text-xs font-comic font-black text-amber-300 mb-1">
                        Lời nhắn gửi từ Nữ Hoàng Nhi Mami:
                      </h4>
                      <p className="text-xs font-comic text-slate-200 leading-relaxed">
                        &quot;Mỗi câu hỏi toán học là một bước chân phiêu lưu của bé Ronie. Trò chơi ghi nhận mọi nỗ lực và sự kiên nhẫn, không tạo áp lực điểm số, giúp bé hình thành tình yêu tự nhiên với các con số!&quot;
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 2: PHÂN TÍCH THEO CHỦ ĐỀ (8 CHỦ ĐỀ TOÁN HỌC) */}
              {/* ============================================================== */}
              {activeTab === 'topics' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-comic font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4" />
                      Phân Tích Chi Tiết 8 Nhóm Kiến Thức Toán Lớp 1
                    </h4>
                    <span className="text-[11px] font-comic text-slate-400">
                      Mức 1 (Nhận biết) đến Mức 5 (Thử thách)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {topicStatsPhase6.map((topic) => (
                      <div
                        key={topic.topicKey}
                        className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 flex flex-col justify-between gap-2 shadow-sm"
                      >
                        {/* Header của chủ đề */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{topic.icon}</span>
                            <div>
                              <div className="text-xs font-comic font-black text-slate-100">
                                {topic.topicName}
                              </div>
                              <div className="text-[10px] font-comic text-slate-400">
                                {topic.curriculumCategory}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-comic font-black text-amber-300">
                              {topic.totalQuestions > 0 ? `${topic.accuracy}%` : 'Chưa luyện tập'}
                            </div>
                            <span
                              className={`text-[9px] font-comic font-bold px-2 py-0.5 rounded-full ${
                                topic.status === 'mastered'
                                  ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/50'
                                  : topic.status === 'practicing'
                                  ? 'bg-amber-900/80 text-amber-300 border border-amber-500/50'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {topic.statusText}
                            </span>
                          </div>
                        </div>

                        {/* Thanh tỷ lệ chính xác */}
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
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

                        {/* Thông tin số liệu */}
                        <div className="grid grid-cols-3 gap-1 bg-slate-900/70 p-2 rounded-xl text-[10px] font-comic">
                          <div>
                            <span className="text-slate-500 block">Cấp độ hiện tại:</span>
                            <span className="font-bold text-slate-200">{topic.levelName}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Luyện tập:</span>
                            <span className="font-bold text-slate-200">
                              {topic.practiceSessionsCount} lượt ({topic.totalQuestions} câu)
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Xu hướng:</span>
                            <span className="font-bold text-slate-200">{topic.trendText}</span>
                          </div>
                        </div>

                        {/* Nội dung cần luyện thêm */}
                        <div className="text-[11px] font-comic text-slate-300 bg-slate-850 p-2 rounded-xl border border-slate-750 flex items-start gap-1.5">
                          <span className="text-amber-400 text-xs mt-0.5">💡</span>
                          <span>{topic.focusAreas}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 3: ĐỀ XUẤT LUYỆN TẬP (SMART RECOMMENDATIONS) */}
              {/* ============================================================== */}
              {activeTab === 'recommendations' && recommendationsData && (
                <div className="space-y-4">
                  {/* TỔNG KẾT PHÂN TÍCH */}
                  <div className="bg-slate-800/90 p-4 rounded-2xl border border-indigo-500/40">
                    <h4 className="text-sm font-comic font-black text-amber-300 mb-2 flex items-center gap-1.5">
                      <Compass className="w-5 h-5 text-indigo-400" />
                      Phân Tích Năng Lực Của Bé
                    </h4>
                    <p className="text-xs font-comic font-bold text-slate-200 leading-relaxed mb-3">
                      {recommendationsData.summary}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-700/80">
                      {/* Điểm mạnh */}
                      <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl">
                        <div className="text-xs font-comic font-black text-emerald-400 mb-1.5 flex items-center gap-1">
                          <Sparkles className="w-4 h-4" /> Bé làm rất tốt:
                        </div>
                        <ul className="space-y-1">
                          {recommendationsData.strengths.map((str, i) => (
                            <li key={i} className="text-xs font-comic text-slate-200 flex items-center gap-1.5">
                              <span className="text-emerald-400">✓</span> {str}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Cần rèn luyện thêm */}
                      <div className="bg-amber-950/40 border border-amber-500/30 p-3 rounded-xl">
                        <div className="text-xs font-comic font-black text-amber-300 mb-1.5 flex items-center gap-1">
                          <Heart className="w-4 h-4" /> Cần bồi dưỡng thêm:
                        </div>
                        <ul className="space-y-1">
                          {recommendationsData.needsPractice.map((np, i) => (
                            <li key={i} className="text-xs font-comic text-slate-200 flex items-center gap-1.5">
                              <span className="text-amber-400">★</span> {np}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* CÁC NHIỆM VỤ ĐỀ XUẤT PHÙ HỢP */}
                  <div>
                    <h4 className="text-xs font-comic font-black text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-400" />
                      Nhiệm Vụ Học Tập Hệ Thống Tự Đề Xuất Cho Bé
                    </h4>

                    <div className="space-y-2.5">
                      {recommendationsData.recommendations.map((rec) => (
                        <div
                          key={rec.id}
                          className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm hover:border-indigo-400/60 transition-all"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`text-[10px] font-comic font-black px-2.5 py-0.5 rounded-full ${
                                  rec.priority === 'high'
                                    ? 'bg-rose-900/80 text-rose-300 border border-rose-500/50'
                                    : rec.priority === 'medium'
                                    ? 'bg-amber-900/80 text-amber-300 border border-amber-500/50'
                                    : 'bg-indigo-900/80 text-indigo-300 border border-indigo-500/50'
                                }`}
                              >
                                {rec.priority === 'high' ? 'Ưu tiên củng cố' : rec.priority === 'medium' ? 'Thử thách nâng cao' : 'Khởi động nhẹ nhàng'}
                              </span>
                              <span className="text-xs font-comic font-bold text-slate-400">
                                {rec.levelName}
                              </span>
                            </div>
                            <div className="text-sm font-comic font-black text-white">
                              {rec.activityTitle}
                            </div>
                            <p className="text-xs font-comic text-slate-300 mt-1">
                              {rec.reason}
                            </p>
                          </div>

                          <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-xs font-comic font-bold text-amber-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                              Mục tiêu: {rec.topicName}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 4: THIẾT LẬP CỦA PHỤ HUYNH (PARENT SETTINGS) */}
              {/* ============================================================== */}
              {activeTab === 'settings' && parentSettings && (
                <div className="space-y-4">
                  {/* KHỐI 1: CHỌN PHẠM VI KIẾN THỨC (8 CHỦ ĐỀ) */}
                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                    <h4 className="text-sm font-comic font-black text-cyan-300 mb-1 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      Phạm Vi Kiến Thức Cho Bé (8 Mạch Chủ Đề)
                    </h4>
                    <p className="text-[11px] font-comic text-slate-400 mb-3">
                      Cha mẹ có thể chủ động bật hoặc tạm tắt các chủ đề chưa học tới ở trường
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(Object.keys(PHASE6_TOPICS_META) as Phase6TopicKey[]).map((topicKey) => {
                        const meta = PHASE6_TOPICS_META[topicKey];
                        const enabledList = (parentSettings.contentConfig?.enabledTopics as string[]) || Object.keys(PHASE6_TOPICS_META);
                        const isEnabled = enabledList.includes(topicKey);

                        return (
                          <button
                            key={topicKey}
                            type="button"
                            onClick={() => handleToggleTopic(topicKey)}
                            className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs font-comic font-bold transition-all cursor-pointer ${
                              isEnabled
                                ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-sm'
                                : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <span>{meta.icon}</span>
                              <span>{meta.name}</span>
                            </span>
                            <span
                              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                isEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'
                              }`}
                            >
                              {isEnabled ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* KHỐI 2: ĐỘ KHÓ NÂNG CAO & CHẾ ĐỘ TÍNH GIỜ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Bật/tắt câu hỏi nâng cao */}
                    <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-comic font-black text-amber-300 flex items-center gap-1">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            Câu Hỏi Nâng Cao (Cấp 4 - 5)
                          </h4>
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleAdvancedQuestions(
                                !(parentSettings.enableAdvancedQuestions ?? true)
                              )
                            }
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-comic font-black cursor-pointer ${
                              parentSettings.enableAdvancedQuestions ?? true
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-700 text-slate-400'
                            }`}
                          >
                            {parentSettings.enableAdvancedQuestions ?? true ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
                          </button>
                        </div>
                        <p className="text-[11px] font-comic text-slate-400 leading-relaxed">
                          Khi bật, hệ thống sẽ đưa thêm các bài toán đố nhiều bước và thử thách tư duy sâu cho bé.
                        </p>
                      </div>
                    </div>

                    {/* Bật/tắt thử thách thời gian */}
                    <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-comic font-black text-sky-300 flex items-center gap-1">
                            <Timer className="w-4 h-4 text-sky-400" />
                            Thử Thách Thời Gian
                          </h4>
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleTimedChallenges(
                                !(parentSettings.enableTimedChallenges ?? true)
                              )
                            }
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-comic font-black cursor-pointer ${
                              parentSettings.enableTimedChallenges ?? true
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-700 text-slate-400'
                            }`}
                          >
                            {parentSettings.enableTimedChallenges ?? true ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
                          </button>
                        </div>
                        <p className="text-[11px] font-comic text-slate-400 leading-relaxed">
                          Khi tắt, đồng hồ đếm ngược sẽ dừng lại để bé làm bài thong thả mà không bị áp lực.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* KHỐI 3: CÀI ĐẶT THỜI LƯỢNG CHƠI & GIỚI HẠN PHIÊN */}
                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-comic font-black text-amber-300 flex items-center gap-1">
                          <Clock className="w-4 h-4 text-amber-400" />
                          Thời Lượng Chơi Mỗi Ngày
                        </h4>
                        <p className="text-[11px] font-comic text-slate-400">
                          Bảo vệ thị lực và tạo thói quen học tập cân bằng
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleTimeLimit(!(parentSettings.isTimeLimitEnabled ?? true))}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-comic font-black cursor-pointer ${
                          parentSettings.isTimeLimitEnabled ?? true
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {parentSettings.isTimeLimitEnabled ?? true ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {[15, 20, 30, 45, 60].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => handleUpdateDailyLimit(mins)}
                          className={`py-2 rounded-xl text-xs font-comic font-black transition-all cursor-pointer ${
                            parentSettings.dailyLimitMinutes === mins
                              ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                          }`}
                        >
                          {mins} phút
                        </button>
                      ))}
                    </div>

                    {/* Giới hạn mỗi phiên học */}
                    <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-comic font-bold text-slate-300 block">
                          Giới hạn mỗi phiên học (nhắc giải lao):
                        </span>
                        <span className="text-[10px] font-comic text-slate-400">
                          Nhắc bé đứng dậy vận động nhẹ nhàng sau phiên
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        {[10, 15, 20, 30].map((sessionMins) => (
                          <button
                            key={sessionMins}
                            type="button"
                            onClick={() => handleUpdateSessionLimit(sessionMins)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-comic font-bold transition-all cursor-pointer ${
                              (parentSettings.sessionLimitMinutes ?? 15) === sessionMins
                                ? 'bg-indigo-500 text-white font-black shadow'
                                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
                            }`}
                          >
                            {sessionMins}p
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 5: LỊCH SỬ HỌC TẬP (LEARNING HISTORY - 100% REAL DATA) */}
              {/* ============================================================== */}
              {activeTab === 'history' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-comic font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <History className="w-4 h-4" />
                      Nhật Ký Các Phiên Học Thực Tế Của Bé
                    </h4>
                    <span className="text-[11px] font-comic text-slate-400">
                      Tổng số: {learningHistory.length} phiên đã lưu
                    </span>
                  </div>

                  {learningHistory.length === 0 ? (
                    <div className="p-8 text-center bg-slate-800/40 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-2">
                        <History className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-comic font-bold text-slate-300">
                        Chưa có dữ liệu phiên học nào được ghi nhận.
                      </p>
                      <p className="text-[11px] font-comic text-slate-500 mt-1 max-w-sm">
                        Khi bé Ronie bắt đầu làm các bài toán trong Nhiệm vụ cốt truyện, Phòng Luyện Toán hoặc Đấu Trường, lịch sử sẽ tự động hiển thị tại đây.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-comic border-collapse">
                          <thead>
                            <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-700 text-[11px]">
                              <th className="py-2.5 px-3">Thời Gian</th>
                              <th className="py-2.5 px-3">Chủ Đề & Hoạt Động</th>
                              <th className="py-2.5 px-3 text-center">Câu Đúng</th>
                              <th className="py-2.5 px-3 text-center">Độ Chính Xác</th>
                              <th className="py-2.5 px-3 text-center">Thời Gian</th>
                              <th className="py-2.5 px-3 text-center">Gợi Ý</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-700/60">
                            {learningHistory.map((item) => (
                              <tr key={item.id} className="hover:bg-slate-750 transition-colors">
                                <td className="py-2 px-3 text-slate-300 whitespace-nowrap text-[11px]">
                                  {item.dateFormatted}
                                </td>
                                <td className="py-2 px-3">
                                  <div className="font-bold text-white">{item.topicName}</div>
                                  <div className="text-[10px] text-indigo-400">{item.modeName}</div>
                                </td>
                                <td className="py-2 px-3 text-center font-bold text-amber-300">
                                  {item.correctQuestions} / {item.totalQuestions}
                                </td>
                                <td className="py-2 px-3 text-center font-black">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] ${
                                      item.accuracy >= 80
                                        ? 'bg-emerald-900 text-emerald-300'
                                        : item.accuracy >= 60
                                        ? 'bg-amber-900 text-amber-300'
                                        : 'bg-rose-900 text-rose-300'
                                    }`}
                                  >
                                    {item.accuracy}%
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-center text-slate-300 whitespace-nowrap">
                                  {item.durationSeconds}s
                                </td>
                                <td className="py-2 px-3 text-center text-slate-400">
                                  {item.hintsUsed}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 6: SAO LƯU & DỮ LIỆU (BACKUP & RESTORE) */}
              {/* ============================================================== */}
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
                        Tải file JSON an toàn chứa toàn bộ tiến trình, lịch sử làm bài và kho đồ của bé
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
                        Nạp lại dữ liệu từ file sao lưu đã lưu trên thiết bị
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

                  {/* ĐẶT LẠI DỮ LIỆU */}
                  <div className="bg-rose-950/30 p-4 rounded-2xl border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-comic font-black text-rose-300 flex items-center gap-1.5">
                        <RotateCcw className="w-4 h-4 text-rose-400" />
                        Đặt Lại Dữ Liệu Học Tập (Reset)
                      </h4>
                      <p className="text-[11px] font-comic text-slate-400">
                        Xóa toàn bộ tiến trình học tập và đưa ứng dụng về trạng thái ban đầu
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(true)}
                      className="w-full sm:w-auto py-2.5 px-4 bg-rose-700 hover:bg-rose-800 active:scale-95 text-white font-comic font-black text-xs rounded-xl shadow transition-all cursor-pointer whitespace-nowrap"
                    >
                      Đặt Lại Dữ Liệu
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* HỘP THOẠI XÁC NHẬN KHÔI PHỤC FILE */}
            {confirmRestoreJson && (
              <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
                <div className="bg-slate-900 border-2 border-amber-400 p-5 rounded-2xl max-w-sm w-full text-center">
                  <h4 className="text-sm font-comic font-black text-amber-300 mb-2">
                    Xác nhận khôi phục dữ liệu?
                  </h4>
                  <p className="text-xs font-comic text-slate-300 mb-4 leading-relaxed">
                    Tiến trình hiện tại trên máy sẽ được thay thế bằng dữ liệu từ file sao lưu.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmRestoreJson(null)}
                      className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-comic font-bold cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmRestore}
                      className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-xs font-comic font-black cursor-pointer"
                    >
                      Đồng ý
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* HỘP THOẠI XÁC NHẬN RESET */}
            {confirmReset && (
              <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
                <div className="bg-slate-900 border-2 border-rose-500 p-5 rounded-2xl max-w-sm w-full text-center">
                  <h4 className="text-sm font-comic font-black text-rose-300 mb-2">
                    Cảnh báo xóa dữ liệu!
                  </h4>
                  <p className="text-xs font-comic text-slate-300 mb-4 leading-relaxed">
                    Bạn có chắc chắn muốn xóa toàn bộ sao, cấp bậc và lịch sử làm bài của bé không?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-comic font-bold cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmReset}
                      className="flex-1 py-2 bg-rose-600 text-white rounded-xl text-xs font-comic font-black cursor-pointer"
                    >
                      Xóa và Đặt Lại
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
