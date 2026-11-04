// src/components/ErrorBoundary.tsx
// Màn hình bắt lỗi và khôi phục an toàn dành cho trẻ em (Child-Safe Error Recovery)

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { RonieAvatar } from '../features/character/RonieAvatar';
import { RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Lỗi giao diện bị chặn bởi ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-sky-200 via-pink-100 to-amber-100 text-slate-800 select-none">
          <div className="relative mb-6">
            <div className="w-36 h-36 rounded-full bg-white/90 border-4 border-amber-300 shadow-2xl flex items-center justify-center animate-bounce">
              <RonieAvatar size="lg" state="idle" />
            </div>
            <div className="text-3xl absolute -top-2 -right-2">🌟</div>
          </div>

          <h2 className="text-2xl md:text-3xl font-black font-comic text-rose-600 text-center drop-shadow-sm mb-2">
            Ronie Đang Nghỉ Giải Lao Một Chút!
          </h2>

          <p className="text-sm md:text-base font-bold text-slate-700 text-center max-w-md mb-6 leading-relaxed">
            Đừng lo lắng bé nhé! Cánh cổng phép thuật hơi mệt một tí thôi. Bé chạm vào nút bên dưới để Ronie đưa bé quay lại vương quốc nhé! 🚀
          </p>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 active:scale-95 text-white font-black font-comic text-base rounded-2xl shadow-lg border-2 border-emerald-300 flex items-center gap-2 cursor-pointer transition-all"
            >
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Chơi Tiếp Cùng Ronie</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
