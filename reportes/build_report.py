import base64
import json
from datetime import date
from pathlib import Path

DIR = Path(__file__).resolve().parent

DIAS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto",
         "septiembre", "octubre", "noviembre", "diciembre"]


def fecha_larga_es(d):
    return f"{DIAS[d.weekday()]} {d.day} de {MESES[d.month - 1]} de {d.year}"


HOY = date.today()
FECHA_INFORME_TXT = fecha_larga_es(HOY)
FECHA_INFORME_ARCHIVO = HOY.isoformat()

with open(DIR / "reporte_data.json", encoding="utf-8") as f:
    equipos = json.load(f)

CAT_INCLUIDAS = ["CARGADOR", "EXCAVADORA", "CAMION"]
equipos = [e for e in equipos if e["categoria"] in CAT_INCLUIDAS]
equipos.sort(key=lambda e: (CAT_INCLUIDAS.index(e["categoria"]), e["patente"]))

logo_b64 = base64.b64encode((DIR / "assets" / "VIA5-logo.png").read_bytes()).decode()

COLOR_PRIMARIO = "#002060"
COLOR_SECUNDARIO = "#208040"
COLOR_ACENTO = "#C0C0E0"
ROJO = "#dc2626"
NARANJO = "#f97316"
AMARILLO = "#facc15"
VERDE = "#16a34a"
GRIS = "#64748b"


def fmt_num(n):
    if n is None:
        return "—"
    return f"{int(round(n)):,}".replace(",", ".")


def fmt_fecha(iso):
    if not iso:
        return "—"
    y, m, d = iso.split("-")
    return f"{d}-{m}-{y}"


def badge(salud):
    mapa = {
        "VENCIDA": (ROJO, "#fff", "VENCIDA"),
        "URGENTE": (NARANJO, "#fff", "URGENTE"),
        "PRONTO": (AMARILLO, "#1e293b", "PRÓXIMA"),
        "OK": (VERDE, "#fff", "OK"),
        "⚠️ LECTURA": (GRIS, "#fff", "SIN LECTURA"),
        "⚙️ PREV": (GRIS, "#fff", "SIN REG. PREV."),
        "🛠️ GEN": (GRIS, "#fff", "SIN REG. GEN."),
    }
    bg, fg, label = mapa.get(salud, (GRIS, "#fff", salud))
    return f'<span class="badge" style="background:{bg};color:{fg}">{label}</span>'


SIN_BASE = {"⚠️ LECTURA": "Sin lectura", "⚙️ PREV": "Sin registro previo", "🛠️ GEN": "Sin registro previo"}


def celda_rest(estado, rest, unidad):
    if estado in SIN_BASE:
        return f'<span class="badge" style="background:{GRIS};color:#fff">{SIN_BASE[estado]}</span>'
    colores = {"VENCIDA": (ROJO, "#fff"), "URGENTE": (NARANJO, "#fff"), "PRONTO": (AMARILLO, "#1e293b"), "OK": (VERDE, "#fff")}
    bg, fg = colores.get(estado, (GRIS, "#fff"))
    n = fmt_num(abs(rest)) if rest is not None else "—"
    if rest is not None and rest <= 0:
        texto = f"{estado} · atrasado {n} {unidad}"
    else:
        texto = f"{estado} · faltan {n} {unidad}"
    return f'<span class="badge" style="background:{bg};color:{fg}">{texto}</span>'


CAT_ICON = {
    "CAMION": "🚛", "CARGADOR": "🚜", "EXCAVADORA": "🚧",
    "CAMIONETA": "🛻", "BATEA": "🚚", "CAMA_BAJA": "🚚", "GENERADOR": "⚡",
}

# Resumen de estados (solo equipos con ciclo aplicable: excluye BATEA/CAMA_BAJA que siempre son OK trivial)
conteo = {"VENCIDA": 0, "URGENTE": 0, "PRONTO": 0, "OK": 0, "OTROS": 0}
for e in equipos:
    s = e["salud"]
    if s in conteo:
        conteo[s] += 1
    else:
        conteo["OTROS"] += 1

filas = []
for e in equipos:
    prefijo_lectura = "Km" if e["unidad"] == "km" else "Hr"
    lectura_txt = f'{prefijo_lectura}: {fmt_num(e["lecturaActual"])}<br><span class="fecha-sub">{fmt_fecha(e["lecturaFecha"])}</span>'
    if e["odometro"] is not None:
        lectura_txt += f'<br>Km: {fmt_num(e["odometro"])}<br><span class="fecha-sub">{fmt_fecha(e["odometroFecha"])}</span>'
    marca, modelo = e["marca"].strip(), e["modelo"].strip()
    if marca == "Mack" and e.get("m3"):
        modelo_txt = f'Mack Granite {e["m3"]} m³'
    elif modelo.lower().startswith(marca.lower()) and marca:
        modelo_txt = modelo
    else:
        modelo_txt = f'{marca} {modelo}'.strip()
    unidad_prev = "km" if e["useKmForPrev"] else "h"
    unidad_gen = "km" if e["useKmForGen"] else "h"
    rest_prev = e["restPrevKm"] if e["useKmForPrev"] else e["restPrev"]
    rest_gen = e["restGenKm"] if e["useKmForGen"] else e["restGen"]
    fila = f"""
    <tr>
      <td class="col-equipo">
        <div class="equipo-nombre">{CAT_ICON.get(e['categoria'],'')} {e['patente']}</div>
        <div class="equipo-sub">{e['categoriaLabel']} · {modelo_txt}</div>
      </td>
      <td class="col-lectura">{lectura_txt}</td>
      <td>{celda_rest(e['estPrev'], rest_prev, unidad_prev)}</td>
      <td>{celda_rest(e['estGen'], rest_gen, unidad_gen)}</td>
      <td class="col-fecha">{fmt_fecha(e['ultimaPreventivaFecha'])}</td>
      <td class="col-fecha">{fmt_fecha(e['ultimaGeneralFecha'])}</td>
      <td class="col-fecha">{fmt_fecha(e['ultimaCorrectivaFecha'])}</td>
    </tr>"""
    filas.append(fila)

html = f"""<!DOCTYPE html>
<html lang="es-CL">
<head>
<meta charset="UTF-8">
<title>Informe Semanal de Mantenciones</title>
<style>
  @page {{ size: A4 landscape; margin: 14mm 12mm; }}
  * {{ box-sizing: border-box; }}
  body {{
    font-family: 'Calibri', 'Arial', sans-serif;
    color: #1e293b;
    margin: 0;
    font-size: 11px;
  }}
  .header {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 3px solid {COLOR_PRIMARIO};
    padding-bottom: 10px;
    margin-bottom: 4px;
  }}
  .header img {{ height: 44px; }}
  .header .titulo {{
    text-align: right;
  }}
  .header .titulo h1 {{
    margin: 0;
    font-size: 18px;
    color: {COLOR_PRIMARIO};
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }}
  .header .titulo p {{
    margin: 2px 0 0;
    font-size: 11px;
    color: {COLOR_SECUNDARIO};
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }}
  .meta {{
    display: flex;
    justify-content: space-between;
    font-size: 10.5px;
    color: #475569;
    margin: 8px 0 14px;
  }}
  .resumen {{
    display: flex;
    gap: 10px;
    margin-bottom: 14px;
  }}
  .resumen .chip {{
    flex: 1;
    text-align: center;
    border-radius: 6px;
    padding: 6px 4px;
    color: #fff;
    font-weight: bold;
  }}
  .resumen .chip .n {{ font-size: 18px; display:block; }}
  .resumen .chip .l {{ font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; }}
  table {{
    width: 100%;
    border-collapse: collapse;
  }}
  thead th {{
    background: {COLOR_PRIMARIO};
    color: #fff;
    text-align: left;
    padding: 7px 8px;
    font-size: 12.5px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }}
  tbody td {{
    padding: 7px 8px;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: top;
    font-size: 13px;
  }}
  tbody tr:nth-child(even) {{ background: #f8fafc; }}
  .equipo-nombre {{ font-weight: bold; color: {COLOR_PRIMARIO}; font-size: 14.5px; }}
  .equipo-sub {{ font-size: 11.5px; color: #64748b; }}
  .col-lectura {{ font-size: 13px; white-space: nowrap; }}
  .fecha-sub {{ font-size: 11px; color: #94a3b8; }}
  .col-fecha {{ white-space: nowrap; }}
  .badge {{
    display: inline-block;
    padding: 3px 8px;
    border-radius: 5px;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    line-height: 1.4;
  }}
  .footer {{
    margin-top: 14px;
    padding-top: 8px;
    border-top: 1px solid {COLOR_ACENTO};
    display: flex;
    justify-content: space-between;
    font-size: 9.5px;
    color: #64748b;
  }}
</style>
</head>
<body>

  <div class="header">
    <img src="data:image/png;base64,{logo_b64}" alt="VIA5">
    <div class="titulo">
      <h1>Informe Semanal de Mantenciones</h1>
      <p>Gestión de Flota — Áridos VIA 5</p>
    </div>
  </div>

  <div class="meta">
    <span><strong>Fecha del informe:</strong> {FECHA_INFORME_TXT}</span>
    <span><strong>Elaborado por:</strong> Ignacio Echeverría Sandoval — Ingeniero de Proyectos y Gestión Ambiental</span>
  </div>

  <div class="resumen">
    <div class="chip" style="background:{ROJO}"><span class="n">{conteo['VENCIDA']}</span><span class="l">Vencidas</span></div>
    <div class="chip" style="background:{NARANJO}"><span class="n">{conteo['URGENTE']}</span><span class="l">Urgentes</span></div>
    <div class="chip" style="background:{AMARILLO};color:#1e293b"><span class="n" style="color:#1e293b">{conteo['PRONTO']}</span><span class="l" style="color:#1e293b">Próximas</span></div>
    <div class="chip" style="background:{VERDE}"><span class="n">{conteo['OK']}</span><span class="l">OK</span></div>
    <div class="chip" style="background:{GRIS}"><span class="n">{conteo['OTROS']}</span><span class="l">Sin registro</span></div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:18%">Equipo</th>
        <th style="width:9%">Lectura Actual</th>
        <th style="width:24%">Preventiva</th>
        <th style="width:18%">General</th>
        <th style="width:9%">Últ. Preventiva</th>
        <th style="width:9%">Últ. General</th>
        <th style="width:9%">Últ. Correctiva</th>
      </tr>
    </thead>
    <tbody>
      {"".join(filas)}
    </tbody>
  </table>

  <div class="footer">
    <span>Vía 5 SpA — Gestión de Flota y Mantenciones</span>
    <span>Fuente: mantenciones-v2 (Firestore) — generado automáticamente</span>
  </div>

</body>
</html>
"""

out_path = DIR / "informe_mantenciones.html"
with open(out_path, "w", encoding="utf-8") as f:
    f.write(html)
print("HTML generado:", out_path)
print("FECHA_INFORME_ARCHIVO:", FECHA_INFORME_ARCHIVO)
