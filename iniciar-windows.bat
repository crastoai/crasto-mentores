@echo off
rem Crasto Mentores · by crasto.ai — liga a mesa no seu Windows (dois cliques neste arquivo).
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Falta o Node.js ^(versao 18 ou mais nova^). Baixe em https://nodejs.org e rode este arquivo de novo.
  pause
  exit /b 1
)
start "" "http://127.0.0.1:4790"
node servidor.mjs
pause
