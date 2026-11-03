// src/features/parent-dashboard/ParentDashboardModal.tsx
// Khu vực quản lý & phân tích năng lực học tập dành riêng cho Phụ huynh (Parent Gate Protected)

import React, { useState } from 'react';
import { ShieldCheck, X, Clock, BarChart3, Download, Upload, Volume2, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../services/audio/AudioManager';

interface ParentDashboardModalProps {
  onClose: () => void;
}

export const ParentDashboardModal: React.FC<ParentDashboardModalProps> = ({ onClose }) => {
  // Trạng thái cổng khóa an toàn (Parent Gate)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [gateAnswer, setGateAnswer] = useState<string>('');
  const [gateError, setGateError] = useState<boolean>(false);

  // Câu hỏi đố người lớn (VD: 34 + 15 = 49)
  const numA = 34;
  const numB = 15;
  const correctGateSum = numA + numB;

  // Cài đặt thời lượng
  const [timeLimit, setTimeLimit] = useState<number>(20);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(!soundManager.getMuted());

  const handleUnlockGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(gateAnswer, 10) === correctGateSum) {
      soundManager.playCorrect();
      setIsUnlocked(true);
      setGateError(false);
    } else {
      soundManager.playTryAgain();
      setGateError(true);
      setGateAnswer('');
    }
  };

  const handleToggleSound = () => {
    const isMuted = soundManager.toggleMute();
    setSoundEnabled(!isMuted);
  };

  const handleExportData = () => {
    soundManager.playTap();
    const mockData = {
      game: 'RONIE & NHI MAMI: VƯƠNG QUỐC TOÁN HỌC',
      exportDate: new Date().toISOString(),
      student: 'Bé Ronie',
      grade: 'Lớp 1 (Chương trình GDPT 2018)',
      starsTotal: 15,
      zonesCompleted: 3,
    };
    const blob = new Blob([JSON.stringify(mockData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ronie_toan_lop1_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl border-4 border-indigo-400 p-6 md:p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-100">
        {/* NÚT ĐÓNG */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* NẾU CHƯA QUA CỔNG PHỤ HUYNH */}
        {!isUnlocked ? (
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 border-2 border-indigo-400 flex items-center justify-center text-indigo-400 mb-4">
              <ShieldCheck className="w-9 h-9" />
            </div>

            <h3 className="text-2xl font-black text-amber-300 mb-2">CỔNG BẢO VỆ PHỤ HUYNH</h3>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-6">
              Khu vực dành riêng cho cha mẹ và thầy cô. Để tiếp tục, xin vui lòng trả lời phép tính sau:
            </p>

            <form onSubmit={handleUnlockGate} className="w-full max-w-xs flex flex-col items-center gap-3">
              <div className="text-xl font-bold text-white bg-slate-800 px-6 py-3 rounded-2xl border border-slate-700 w-full">
                {numA} + {numB} = ?
              </div>

              <input
                type="number"
                value={gateAnswer}
                onChange={(e) => setGateAnswer(e.target.value)}
                placeholder="Nhập kết quả..."
                className="w-full px-4 py-3 bg-slate-950 border-2 border-slate-700 focus:border-amber-400 rounded-2xl text-center text-xl font-black text-amber-300 outline-none"
                autoFocus
              />

              {gateError && (
                <span className="text-xs font-bold text-rose-400">
                  Kết quả chưa chính xác, xin vui lòng thử lại!
                </span>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white font-black rounded-2xl shadow-lg transition-all cursor-pointer"
              >
                Mở Bảng Điều Khiển
              </button>
            </form>
          </div>
        ) : (
          /* BẢNG ĐIỀU KHIỂN ĐÃ MỞ KHÓA */
          <div className="flex flex-col flex-1 overflow-y-auto pr-1">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2.5 bg-indigo-600 rounded-2xl text-white">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-amber-300">BẢNG THEO DÕI HỌC TẬP TOÁN LỚP 1</h3>
                <p className="text-xs text-slate-400">Đồng hành cùng bé Ronie theo chuẩn Bộ GD&ĐT</p>
              </div>
            </div>

            {/* BẢNG PHÂN TÍCH NĂNG LỰC TOÁN HỌC */}
            <div className="my-5">
              <h4 className="text-sm font-bold text-cyan-300 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Mức Độ Thành Thạo 5 Mạch Kiến Thức
              </h4>

              <div className="space-y-3">
                {[
                  { title: '1. Nhận biết số & Đếm (0 - 10)', score: 95, color: 'bg-emerald-500' },
                  { title: '2. Phép Cộng trong phạm vi 10 & 20', score: 88, color: 'bg-amber-500' },
                  { title: '3. Phép Trừ & Cán cân thăng bằng', score: 80, color: 'bg-rose-500' },
                  { title: '4. Hình học phẳng & Đo độ dài cm', score: 92, color: 'bg-sky-500' },
                  { title: '5. Số tròn chục & Đồng hồ kim', score: 75, color: 'bg-purple-500' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-800/70 p-3 rounded-2xl border border-slate-700">
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-200">{item.title}</span>
                      <span className="text-amber-300">{item.score}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CÀI ĐẶT THỜI GIAN & AN TOÀN */}
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 mb-4">
              <h4 className="text-sm font-bold text-amber-300 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Giới Hạn Thời Gian Chơi Mỗi Ngày
              </h4>
              <div className="flex gap-2">
                {[15, 20, 30, 45].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => {
                      soundManager.playTap();
                      setTimeLimit(mins);
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      timeLimit === mins
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mins} phút
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                * Sau khi hết thời gian, ứng dụng sẽ hiện lời nhắc bé Ronie nghỉ ngơi thư giãn mắt.
              </p>
            </div>

            {/* NÚT THAO TÁC CÀI ĐẶT KHÁC */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleToggleSound}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Âm thanh: {soundEnabled ? 'BẬT' : 'TẮT'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportData}
                className="px-4 py-2 bg-indigo-600/80 hover:bg-indigo-600 rounded-xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Sao Lưu Dữ Liệu (JSON)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
