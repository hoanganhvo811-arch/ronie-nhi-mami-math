// src/design-system/WoodenChalkboard.tsx
// Bảng đen gỗ thần kỳ trong khu rừng học toán (Magical Wooden Chalkboard - Image 2 Reference)

import React from 'react';

interface WoodenChalkboardProps {
  title?: string;
  children: React.ReactNode;
  headerAddon?: React.ReactNode;
  footerAddon?: React.ReactNode;
  className?: string;
}

export const WoodenChalkboard: React.FC<WoodenChalkboardProps> = ({
  title,
  children,
  headerAddon,
  footerAddon,
  className = '',
}) => {
  return (
    <div
      className={`relative w-full max-w-3xl rounded-3xl p-3 sm:p-5 bg-gradient-to-b from-amber-800 via-amber-900 to-amber-950 border-4 border-amber-950 shadow-[0_15px_30px_rgba(0,0,0,0.5),0_5px_0_#451a03] select-none ${className}`}
    >
      {/* 4 ĐINH TÁN BẰNG ĐỒNG Ở 4 GÓC KHUNG GỖ */}
      <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-600 via-amber-300 to-yellow-100 shadow-inner border border-amber-900" />
      <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-600 via-amber-300 to-yellow-100 shadow-inner border border-amber-900" />
      <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-600 via-amber-300 to-yellow-100 shadow-inner border border-amber-900" />
      <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-600 via-amber-300 to-yellow-100 shadow-inner border border-amber-900" />

      {/* MẶT BẢNG ĐEN XANH RỪNG SÂU CHỐNG CHÓI */}
      <div className="relative w-full rounded-2xl bg-gradient-to-b from-emerald-950 via-teal-950 to-slate-950 p-4 sm:p-6 border-3 border-amber-950/80 shadow-inner text-white flex flex-col items-center">
        {/* Vệt bụi phấn mờ nghệ thuật */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_70%)] pointer-events-none rounded-2xl" />

        {/* TIÊU ĐỀ BẢNG PHẤN */}
        {(title || headerAddon) && (
          <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-emerald-800/60 relative z-10">
            {title && (
              <h3 className="font-comic font-black text-sm sm:text-lg text-amber-300 tracking-wide flex items-center gap-2 drop-shadow-sm">
                <span>🌟</span>
                <span>{title}</span>
              </h3>
            )}
            {headerAddon && <div className="ml-auto">{headerAddon}</div>}
          </div>
        )}

        {/* NỘI DUNG CHÍNH (CÂU HỎI / BÀI TOÁN / HÌNH ẢNH) */}
        <div className="w-full relative z-10">{children}</div>

        {/* KHAY ĐỂ PHẤN VÀ KHĂN LAU DƯỚI ĐÁY BẢNG */}
        {footerAddon && (
          <div className="w-full mt-4 pt-3 border-t border-emerald-900/60 relative z-10 flex items-center justify-between">
            {footerAddon}
          </div>
        )}
      </div>

      {/* MẶT ĐỠ KHAY BẢNG BẰNG GỖ */}
      <div className="w-11/12 mx-auto -mb-1 h-2.5 bg-amber-950 rounded-b-xl shadow-md flex items-center justify-center">
        <div className="w-16 h-1 bg-white/40 rounded-full" />
      </div>
    </div>
  );
};
