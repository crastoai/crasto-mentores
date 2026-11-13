#!/bin/bash
# Crasto Mentores · by crasto.ai — liga a mesa no seu Mac (dois cliques neste arquivo).
cd "$(dirname "$0")" || exit 1
if ! command -v node >/dev/null 2>&1; then
  echo "Falta o Node.js (versão 18 ou mais nova). Baixe em https://nodejs.org e rode este arquivo de novo."
  read -r -p "Aperte Enter para fechar." _; exit 1
fi
(sleep 1.5; open "http://127.0.0.1:4790") &
node servidor.mjs
read -r -p "A mesa foi desligada. Aperte Enter para fechar." _
