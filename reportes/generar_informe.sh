#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

# Entorno Python aislado para pymupdf (limpieza de metadatos del PDF).
if [ ! -d ".venv" ]; then
  python3 -m venv .venv
  ./.venv/bin/pip install --quiet pymupdf
fi

echo "== Descargando flota desde Firestore =="
node fetch_flota.mjs

echo "== Calculando estado de cada equipo =="
node compute_report.mjs

echo "== Generando HTML =="
FECHA=$(python3 build_report.py | tee /dev/stderr | grep FECHA_INFORME_ARCHIVO | cut -d' ' -f2)

echo "== Convirtiendo a PDF =="
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="informe_mantenciones.pdf" \
  "informe_mantenciones.html" 2>/dev/null

echo "== Limpiando metadatos =="
./.venv/bin/python3 clean_pdf.py "informe_mantenciones.pdf"

DEST="../../Informe Semanal Mantenciones VIA5 ${FECHA}.pdf"
cp "informe_mantenciones.pdf" "$DEST"
echo "== Informe guardado en: $DEST =="
