@echo off
setlocal EnableDelayedExpansion
chcp 65001 > nul
title RONIE VA NHI MAMI - VUONG QUOC TOAN HOC

:: Chuyển đến thư mục chứa file .bat này
cd /d "%~dp0"

echo ======================================================================
echo    RONIE VA NHI MAMI: VUONG QUOC TOAN HOC (TOAN LOP 1)
echo ======================================================================
echo.
echo  [1/3] Kiem tra moi truong Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] KHONG TIM THAY NODE.JS TREN MAY TINH!
    echo Vui long cai dat Node.js tu https://nodejs.org roi thu lai.
    echo.
    pause
    exit /b 1
)

echo  [2/3] Kiem tra thu vien tro choi (node_modules)...
if not exist "node_modules\" (
    echo [*] Thu vien chua co. Dang tu dong chay npm install...
    call npm.cmd install
    if %errorlevel% neq 0 (
        echo [!] Cai dat that bai! Vui long kiem tra ket noi mang.
        pause
        exit /b 1
    )
    echo [*] Cai dat hoan tat!
)

echo.
echo  [3/3] Dang khoi dong may chu tro choi...
echo ----------------------------------------------------------------------
echo  Dia chi may chu: http://localhost:3399
echo  Trinh duyet web se tu dong mo ngay bay gio...
echo  De tat tro choi: Dong cua so nay hoac nhan Ctrl + C
echo ----------------------------------------------------------------------
echo.

:: Mo trinh duyet
start "" "http://localhost:3399"

:: Khoi chay Vite server
call npm.cmd run dev

echo.
echo Tro choi da dung.
pause
