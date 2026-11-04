#!/bin/sh
# Копирует игру в вики архива.
set -e
cp "$(dirname "$0")/konsultant.html" "$HOME/Yandex.Disk.localized/РГГУ-ИВИ/_wiki/Консультант ЦК (игра).html"
echo "Скопировано в вики."
