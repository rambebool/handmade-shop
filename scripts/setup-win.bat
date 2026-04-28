@echo off
chcp 65001 >nul 2>&1
echo.
echo ============================================
echo   HANDMADE.SHOP — Установка и запуск
echo ============================================
echo.

:: Проверка Node.js
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ОШИБКА] Node.js не найден!
    echo.
    echo Установите Node.js 18+ по ссылке:
    echo   https://nodejs.org/en/download
    echo.
    echo После установки перезапустите этот скрипт.
    echo.
    pause
    exit /b 1
)

:: Проверка npm
where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ОШИБКА] npm не найден!
    echo.
    echo npm обычно устанавливается вместе с Node.js.
    echo Скачайте Node.js: https://nodejs.org/en/download
    echo.
    pause
    exit /b 1
)

:: Вывод версий
echo [OK] Node.js:
node --version
echo [OK] npm:
npm --version
echo.

:: Установка зависимостей
echo Устанавливаю зависимости (npm install)...
echo Это может занять 1-2 минуты...
echo.
call npm install
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ОШИБКА] Не удалось установить зависимости.
    echo Попробуйте удалить папку node_modules и запустить скрипт снова.
    pause
    exit /b 1
)

echo.
echo ============================================
echo.
echo   Сайт запущен: http://localhost:3000
echo.
echo   Тестовые данные загружены автоматически.
echo   Откройте ссылку выше в браузере.
echo.
echo   Для остановки нажмите Ctrl+C в этом окне.
echo.
echo ============================================
echo.

:: Запуск dev-сервера
call npm run dev
