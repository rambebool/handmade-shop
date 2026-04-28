#!/bin/bash

echo ""
echo "============================================"
echo "  HANDMADE.SHOP — Установка и запуск"
echo "============================================"
echo ""

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "[ОШИБКА] Node.js не найден!"
    echo ""
    echo "Установите Node.js 18+ одним из способов:"
    echo ""
    echo "  Ubuntu/Debian:"
    echo "    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
    echo "    sudo apt-get install -y nodejs"
    echo ""
    echo "  Или скачайте с сайта:"
    echo "    https://nodejs.org/en/download"
    echo ""
    echo "После установки перезапустите этот скрипт."
    exit 1
fi

# Проверка npm
if ! command -v npm &> /dev/null; then
    echo "[ОШИБКА] npm не найден!"
    echo ""
    echo "npm обычно устанавливается вместе с Node.js."
    echo "Скачайте Node.js: https://nodejs.org/en/download"
    exit 1
fi

# Вывод версий
echo "[OK] Node.js: $(node --version)"
echo "[OK] npm: $(npm --version)"
echo ""

# Установка зависимостей
echo "Устанавливаю зависимости (npm install)..."
echo "Это может занять 1-2 минуты..."
echo ""

npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "[ОШИБКА] Не удалось установить зависимости."
    echo "Попробуйте удалить папку node_modules и запустить скрипт снова:"
    echo "  rm -rf node_modules && bash scripts/setup-linux.sh"
    exit 1
fi

echo ""
echo "============================================"
echo ""
echo "  ✅ Сайт запущен: http://localhost:3000"
echo ""
echo "  Тестовые данные загружены автоматически."
echo "  Откройте ссылку выше в браузере."
echo ""
echo "  Для остановки нажмите Ctrl+C в этом окне."
echo ""
echo "============================================"
echo ""

# Запуск dev-сервера
npm run dev
