// src/App.jsx — VIA5 Mantenciones v2.1
import React, { useMemo, useState, useEffect, useCallback, memo } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  getFirestore, collection, onSnapshot, addDoc,
  updateDoc, doc, deleteDoc, serverTimestamp
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwBnvWXLKO7ctOwmHYf4SO2CACz1D6ADI",
  authDomain: "mantenciones-v-5.firebaseapp.com",
  projectId: "mantenciones-v-5",
  storageBucket: "mantenciones-v-5.firebasestorage.app",
  messagingSenderId: "294743117767",
  appId: "1:294743117767:web:27f28d9e2276484308d3e2",
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
async function ensureAnonAuth() {
  if (!auth.currentUser) await signInAnonymously(auth);
  return auth.currentUser;
}

const P = {
  page:"#f1f5f9", card:"#ffffff", border:"#e2e8f0",
  dark:"#0f172a", txtTitle:"#0f172a", txtBody:"#374151",
  txtLabel:"#1e293b", txtMuted:"#64748b", txtDim:"#94a3b8",
  txtLight:"#e2e8f0", txtWhite:"#ffffff",
  red:"#dc2626", redLight:"#fca5a5", orange:"#f97316",
  yellow:"#facc15", green:"#16a34a", blue:"#2563eb",
};

/* ═══════════════════════ DATOS MAESTROS ═══════════════════════ */
const MAESTRO = {
  "DFLW-71": {
    modelo:"Mack Granite", preventivaCada:300, generalCada:2000,
    horaActual:12256, horaActualFecha:"2026-04-29",
    ultimaPreventivaHora:12023, ultimaGeneralHora:0,
    insumosPrev:[
      {tipo:"Aceite", nombre:"Motor 15W-40",              cant:38, enBodega:false},
      {tipo:"Filtro", nombre:"Aire",                       cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Kit MP8",                    cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Desecante AD9 Coalescente",  cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Plisado polvo cabina",       cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Hidráulico dirección",       cant:1,  enBodega:false},
    ],
    insumosGen:[],
  },
  "DRHK-42": {
    modelo:"Mack Granite CT6", preventivaCada:300, generalCada:2000,
    horaActual:10284, horaActualFecha:"2025-11-13",
    ultimaPreventivaHora:10284, ultimaGeneralHora:0,
    insumosPrev:[
      {tipo:"Aceite", nombre:"Motor 15W-40",              cant:38, enBodega:false},
      {tipo:"Filtro", nombre:"Aire",                       cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Kit MP8",                    cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Desecante AD9 Coalescente",  cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Plisado polvo cabina",       cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Hidráulico dirección",       cant:1,  enBodega:false},
    ],
    insumosGen:[],
  },
  "DHXR-54": {
    modelo:"Mack Granite", preventivaCada:300, generalCada:2000,
    horaActual:15692, horaActualFecha:"2026-03-19",
    ultimaPreventivaHora:0, ultimaGeneralHora:0,
    insumosPrev:[
      {tipo:"Aceite", nombre:"Motor 15W-40",              cant:38, enBodega:false},
      {tipo:"Filtro", nombre:"Aire",                       cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Kit MP8",                    cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Desecante AD9 Coalescente",  cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Plisado polvo cabina",       cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Hidráulico dirección",       cant:1,  enBodega:false},
    ],
    insumosGen:[],
  },
  "WY-8717": {
    modelo:"Mack", preventivaCada:300, generalCada:2000,
    horaActual:0, horaActualFecha:"", ultimaPreventivaHora:0, ultimaGeneralHora:0,
    insumosPrev:[
      {tipo:"Aceite", nombre:"Motor 15W-40",              cant:38, enBodega:false},
      {tipo:"Filtro", nombre:"Aire",                       cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Kit MP8",                    cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Desecante AD9 Coalescente",  cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Plisado polvo cabina",       cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Hidráulico dirección",       cant:1,  enBodega:false},
    ],
    insumosGen:[],
  },
  "RHGC-83": {
    modelo:"Volkswagen Constellation", preventivaCada:300, generalCada:2000,
    horaActual:7482, horaActualFecha:"2026-04-02",
    ultimaPreventivaHora:7457, ultimaGeneralHora:0,
    insumosPrev:[
      {tipo:"Aceite", nombre:"Motor 15W-40",               cant:38, enBodega:false},
      {tipo:"Filtro", nombre:"Aceite PSL909 (LF9009)",      cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Petróleo PSC76",              cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Decantador PC727 (PF7748)",   cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Aire exterior ARS9839",       cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Deshumidificador DSF0202",    cant:1,  enBodega:false},
    ],
    insumosGen:[
      {tipo:"Aceite", nombre:"Diferencial 85W-140",         cant:40, enBodega:false},
      {tipo:"Aceite", nombre:"Caja de cambios 75W-80",      cant:10, enBodega:false},
      {tipo:"Aceite", nombre:"Hidráulico tolva ISO 68",     cant:60, enBodega:false},
    ],
  },
  "RKSC-25": {
    modelo:"Volkswagen Constellation", preventivaCada:300, generalCada:2000,
    horaActual:8091, horaActualFecha:"2026-04-02",
    ultimaPreventivaHora:8091, ultimaGeneralHora:7634,
    insumosPrev:[
      {tipo:"Aceite", nombre:"Motor 15W-40",               cant:38, enBodega:false},
      {tipo:"Filtro", nombre:"Aceite PSL909 (LF9009)",      cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Petróleo PSC76",              cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Decantador PC727 (PF7748)",   cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Aire exterior ARS9839",       cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Deshumidificador DSF0202",    cant:1,  enBodega:false},
    ],
    insumosGen:[
      {tipo:"Aceite", nombre:"Diferencial 85W-140",         cant:40, enBodega:false},
      {tipo:"Aceite", nombre:"Caja de cambios 75W-80",      cant:10, enBodega:false},
      {tipo:"Aceite", nombre:"Hidráulico tolva ISO 68",     cant:60, enBodega:false},
    ],
  },
  "SW-6114": {
    modelo:"Renault", preventivaCada:300, generalCada:2000,
    horaActual:0, horaActualFecha:"", ultimaPreventivaHora:0, ultimaGeneralHora:0,
    insumosPrev:[
      {tipo:"Filtro", nombre:"Petróleo", cant:3, enBodega:false},
    ],
    insumosGen:[],
  },
  "HDWS-49": {
    modelo:"Hyundai R220", preventivaCada:250, generalCada:2000,
    horaActual:11275, horaActualFecha:"2026-01-28",
    ultimaPreventivaHora:11181, ultimaGeneralHora:10933,
    insumosPrev:[
      {tipo:"Aceite", nombre:"Motor 15W-40",            cant:23, enBodega:false},
      {tipo:"Filtro", nombre:"Aceite PSL280",            cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Petróleo PSC410",          cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Petróleo BF788 / CX0708",  cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Petróleo BF1329",          cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Aire primario RS3517",     cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Aire secundario RS3717",   cant:1,  enBodega:false},
    ],
    insumosGen:[
      {tipo:"Aceite", nombre:"Mandos finales 10W-30",    cant:60, enBodega:false},
      {tipo:"Aceite", nombre:"Transmisión 10W-30",       cant:8,  enBodega:false},
      {tipo:"Aceite", nombre:"Hidráulico 80W-90",        cant:90, enBodega:false},
    ],
  },
  "LVGS-87": {
    modelo:"Hyundai LC220", preventivaCada:250, generalCada:2000,
    horaActual:8266, horaActualFecha:"2025-12-16",
    ultimaPreventivaHora:8266, ultimaGeneralHora:8000,
    insumosPrev:[
      {tipo:"Aceite", nombre:"Motor 15W-40",            cant:23, enBodega:false},
      {tipo:"Filtro", nombre:"Aceite PSL280",            cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Petróleo PSC410",          cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Petróleo BF1394 SP",       cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Aire primario RS3517",     cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Aire secundario RS3717",   cant:1,  enBodega:false},
    ],
    insumosGen:[
      {tipo:"Aceite", nombre:"Mandos finales 10W-30",    cant:60, enBodega:false},
      {tipo:"Aceite", nombre:"Transmisión 10W-30",       cant:8,  enBodega:false},
      {tipo:"Aceite", nombre:"Hidráulico 80W-90",        cant:90, enBodega:false},
    ],
  },
  "TCCW-19": {
    modelo:"Develon DX225LX-7M", preventivaCada:250, generalCada:2000,
    horaActual:3852, horaActualFecha:"2026-04-02",
    ultimaPreventivaHora:3852, ultimaGeneralHora:3510,
    insumosPrev:[
      {tipo:"Aceite", nombre:"Motor 15W-40",                cant:35, enBodega:false},
      {tipo:"Filtro", nombre:"Aire primario ARS4844",        cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Aire secundario ARS844",       cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Separador agua PSD460/1",      cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Aceite B7039",                 cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Petróleo PSC75",               cant:1,  enBodega:false},
    ],
    insumosGen:[
      {tipo:"Aceite", nombre:"Motor 15W-40",                cant:35, enBodega:false},
      {tipo:"Aceite", nombre:"Giro 80W-90",                  cant:8,  enBodega:false},
      {tipo:"Aceite", nombre:"Reductores 80W-90",            cant:12, enBodega:false},
      {tipo:"Filtro", nombre:"Malla combustible 400411-00102",    cant:1, enBodega:false},
      {tipo:"Filtro", nombre:"Pre-filtro combustible 400504-00045",cant:1, enBodega:false},
      {tipo:"Filtro", nombre:"By-pass 400411-00001A",        cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Piloto hidráulico 400504-00241",    cant:1, enBodega:false},
      {tipo:"Filtro", nombre:"AC cabina 400402-00077A",      cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"AC externo 400402-00076B",     cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Principal hidráulico 400504-00483B",cant:1, enBodega:false},
      {tipo:"Filtro", nombre:"Succión hidráulico 400408-00110",   cant:1, enBodega:false},
      {tipo:"Filtro", nombre:"Respiradero hidráulico 400504-00254",cant:1,enBodega:false},
      {tipo:"Otro",   nombre:"Correa V ventilador 130205-00251",  cant:1, enBodega:false},
      {tipo:"Otro",   nombre:"Correa accesorios 2106-1019D25",    cant:1, enBodega:false},
    ],
  },
  "LXDT-19": {
    modelo:"Hyundai HL757-9S", preventivaCada:200, generalCada:2000,
    horaActual:7544, horaActualFecha:"2025-12-05",
    ultimaPreventivaHora:7231, ultimaGeneralHora:7544,
    insumosPrev:[
      {tipo:"Aceite", nombre:"Motor 15W-40 Mobil",          cant:28, enBodega:false},
      {tipo:"Filtro", nombre:"Aire primario ARS2758 Tecfill",cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Aire secundario ARS758 Tecfill",cant:1, enBodega:false},
      {tipo:"Filtro", nombre:"Decantador PSD470 Tecfill",    cant:2,  enBodega:false},
      {tipo:"Filtro", nombre:"Petróleo PSC75 Tecfill",       cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Aceite B7177 Baldwin",         cant:1,  enBodega:false},
    ],
    insumosGen:[
      {tipo:"Aceite", nombre:"Hidráulico Unitractor 10W-30 Lubrax",  cant:0, enBodega:false},
      {tipo:"Aceite", nombre:"Diferencial Unitractor 10W-30 Lubrax", cant:0, enBodega:false},
    ],
  },
  "SDTP-59": {
    modelo:"Komatsu WA320", preventivaCada:250, generalCada:2000,
    horaActual:7166, horaActualFecha:"2026-04-20",
    ultimaPreventivaHora:7166, ultimaGeneralHora:6036,
    insumosPrev:[
      {tipo:"Aceite", nombre:"Motor 15W-40",            cant:25, enBodega:false},
      {tipo:"Filtro", nombre:"Aceite PSL280",            cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Petróleo PSC76",           cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Petróleo BF1394 SP",       cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Aire primario RS3517",     cant:1,  enBodega:false},
      {tipo:"Filtro", nombre:"Aire secundario RS3717",   cant:1,  enBodega:false},
    ],
    insumosGen:[
      {tipo:"Aceite", nombre:"Mandos finales 10W-30",    cant:60, enBodega:false},
      {tipo:"Aceite", nombre:"Transmisión 10W-30",       cant:8,  enBodega:false},
      {tipo:"Aceite", nombre:"Hidráulico 80W-90",        cant:90, enBodega:false},
    ],
  },
  "RHRB-94": {
    modelo:"Maxus", preventivaCada:10000, generalCada:0,
    horaActual:139982, horaActualFecha:"2025-12-21",
    ultimaPreventivaHora:139982, ultimaGeneralHora:0,
    insumosPrev:[
      {tipo:"Aceite", nombre:"Motor 5W-30", cant:0, enBodega:false},
      {tipo:"Filtro", nombre:"Petróleo",    cant:1, enBodega:false},
    ],
    insumosGen:[],
  },
  "TTVR-19": {
    modelo:"Peugeot", preventivaCada:10000, generalCada:0,
    horaActual:0, horaActualFecha:"", ultimaPreventivaHora:0, ultimaGeneralHora:0,
    insumosPrev:[], insumosGen:[],
  },
};

/* ═══════════════════════ HISTORIAL COMPLETO ═══════════════════════ */
const HISTORIAL = {
  "DFLW-71": [
    {fecha:"2023-03-20", tipo:"OTRO",       detalle:"Engrase completo y lavado"},
    {fecha:"2023-04-21", tipo:"OTRO",       detalle:"Engrase completo y lavado"},
    {fecha:"2023-05-23", tipo:"CORRECTIVA", detalle:"Perno centro. Cambio abrazadera lado delantero y tuerca"},
    {fecha:"2023-05-26", tipo:"OTRO",       detalle:"Engrase completo y lavado"},
    {fecha:"2023-06-08", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2023-06-22", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2023-07-17", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2023-08-16", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2023-09-25", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2023-10-21", tipo:"CORRECTIVA", detalle:"Cambio correa de ventilador"},
    {fecha:"2023-12-04", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2023-12-18", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2023-12-22", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 36L + filtro. Km: 344.941"},
    {fecha:"2024-01-08", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-01-10", tipo:"PREVENTIVA", detalle:"Cambio filtro de aire"},
    {fecha:"2024-01-25", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-02-02", tipo:"CORRECTIVA", detalle:"Cambio neumático"},
    {fecha:"2024-02-12", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-03-04", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-03-08", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-03-28", tipo:"OTRO",       detalle:"Engrase completo y lavado"},
    {fecha:"2024-05-06", tipo:"PREVENTIVA", detalle:"Cambio de filtro. Km: 349.160"},
    {fecha:"2024-05-23", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-07-01", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-07-10", tipo:"CORRECTIVA", detalle:"Cambio 3 botellas hidráulicas / baterías nuevas"},
    {fecha:"2024-08-17", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-08-28", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-09-11", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-10-03", tipo:"PREVENTIVA", detalle:"Cambio filtro de aire"},
    {fecha:"2024-10-08", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 38L + filtros. Km: 354.318"},
    {fecha:"2024-11-04", tipo:"OTRO",       detalle:"Engrase completo. Km: 355.207"},
    {fecha:"2024-11-21", tipo:"CORRECTIVA", detalle:"Cambio pulmón"},
    {fecha:"2024-12-05", tipo:"OTRO",       detalle:"Engrase completo. Km: 355.851"},
    {fecha:"2024-12-21", tipo:"CORRECTIVA", detalle:"Cambio telecomando"},
    {fecha:"2025-01-15", tipo:"CORRECTIVA", detalle:"Clausura freno rueda izquierdo delantero"},
    {fecha:"2025-01-29", tipo:"CORRECTIVA", detalle:"Cambio 4 quesos suspensión punta paquete, 1 hoja resorte, perno centro, 2 abrazaderas eje trasero izq."},
    {fecha:"2025-03-12", tipo:"CORRECTIVA", detalle:"Repaso botella de la tolva. Km: 359.638"},
    {fecha:"2025-09-10", tipo:"OTRO",       detalle:"Engrase completo. Km: 359.675"},
    {fecha:"2025-12-15", tipo:"CORRECTIVA", detalle:"Arreglo (ilegible). Km: 360.716"},
    {fecha:"2026-01-08", tipo:"OTRO",       detalle:"Engrase completo. Hr: 12.019 / Km: 361.133"},
    {fecha:"2026-01-12", tipo:"PREVENTIVA", detalle:"Cambio filtro de aire. Hr: 12.023 / Km: 361.181"},
    {fecha:"2026-01-30", tipo:"CORRECTIVA", detalle:"Cambio abrazadera lado izquierdo y una hoja trasera"},
    {fecha:"2026-03-02", tipo:"OTRO",       detalle:"Engrase completo. Hr: 12.144 / Km: 362.695"},
    {fecha:"2026-04-27", tipo:"CORRECTIVA", detalle:"Cambio de neumático"},
  ],
  "DRHK-42": [
    {fecha:"2024-11-06", tipo:"OTRO",       detalle:"Ingreso equipo. Engrase completo. Km: 158.420"},
    {fecha:"2024-11-20", tipo:"PREVENTIVA", detalle:"Cambio filtro de aire. Km: 159.217"},
    {fecha:"2024-12-06", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-12-11", tipo:"CORRECTIVA", detalle:"Cambio empaquetadura bomba por pérdida aceite hidráulico"},
    {fecha:"2024-12-11", tipo:"CORRECTIVA", detalle:"Colocación empaquetadura toma de fuerza"},
    {fecha:"2025-01-06", tipo:"OTRO",       detalle:"Engrase completo. Km: 159.681"},
    {fecha:"2025-01-17", tipo:"CORRECTIVA", detalle:"Cambio empaquetadura toma fuerza caja de transmisión"},
    {fecha:"2025-01-21", tipo:"OTRO",       detalle:"Engrase completo. Km: 160.186"},
    {fecha:"2025-03-26", tipo:"CORRECTIVA", detalle:"Cambio botella hidráulica y aceite. Reparación Puerto Montt. Botella nueva instalada. Cambio aceite hidráulico con filtros. Soporte y bomba hidráulica fabricados. Cambio empaquetadura toma de fuerza. Km: 160.553"},
    {fecha:"2025-04-01", tipo:"OTRO",       detalle:"Engrase completo. Km: 160.887"},
    {fecha:"2025-04-16", tipo:"OTRO",       detalle:"Engrase completo. Km: 161.572"},
    {fecha:"2025-05-06", tipo:"CORRECTIVA", detalle:"Cambio base freno y sensor de aire (ilegible). Km: 161.806"},
    {fecha:"2025-05-15", tipo:"OTRO",       detalle:"Engrase completo. Km: 161.994"},
    {fecha:"2025-06-17", tipo:"OTRO",       detalle:"Engrase completo. Km: 163.111"},
    {fecha:"2025-06-24", tipo:"CORRECTIVA", detalle:"Cambio amortiguadores de la cabina. Km: 163.176"},
    {fecha:"2025-09-01", tipo:"CORRECTIVA", detalle:"Corrección correa ventilación y enchufe viscoso. Regulación frenos. Reapriete pulmón suelto. Hr: 10.077"},
    {fecha:"2025-09-04", tipo:"CORRECTIVA", detalle:"Cambio correa de accesorios internos"},
    {fecha:"2025-09-24", tipo:"CORRECTIVA", detalle:"Cambio retén maza. Recambio balatas lado izquierdo trasero. Relleno aceite corona 5L 80W90"},
    {fecha:"2025-11-13", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 15W-40 38L + filtros completos. Hr: 10.284 / Km: 167.590"},
    {fecha:"2025-11-20", tipo:"CORRECTIVA", detalle:"Cambio pulmón de freno. Pendiente válvula repartidora de aire."},
    {fecha:"2025-11-25", tipo:"CORRECTIVA", detalle:"Reparación estanque hidráulico."},
    {fecha:"2026-04-29", tipo:"CORRECTIVA", detalle:"Embalado 8 mazas. Cambio 4 retenes maza, 4 chicharras freno. Relleno aceite corona 20L 80W-90. Relleno aceite motor 5L 15W-40"},
  ],
  "DHXR-54": [
    {fecha:"2023-05-17", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2023-06-29", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2023-07-07", tipo:"CORRECTIVA", detalle:"Cambio 3 baterías"},
    {fecha:"2023-07-12", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2023-07-22", tipo:"CORRECTIVA", detalle:"Cambio soporte de cardan y engrase completo"},
    {fecha:"2023-08-17", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2023-09-25", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2023-10-16", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2023-10-26", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2023-11-08", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2023-12-04", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-01-26", tipo:"PREVENTIVA", detalle:"Engrase completo + cambio aceite motor 33L + filtros. Km: 205.439"},
    {fecha:"2024-02-12", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-05-20", tipo:"CORRECTIVA", detalle:"Cambio bomba de agua"},
    {fecha:"2024-06-11", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-08-19", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-08-27", tipo:"CORRECTIVA", detalle:"Reparación tubo de escape y revisión de maza"},
    {fecha:"2024-11-04", tipo:"OTRO",       detalle:"Engrase completo. Km: 207.697"},
    {fecha:"2025-01-08", tipo:"OTRO",       detalle:"Engrase completo. Km: 208.366"},
    {fecha:"2025-05-16", tipo:"CORRECTIVA", detalle:"Cambio botella hidráulica levante tolva. Km: 209.332"},
    {fecha:"2025-06-17", tipo:"OTRO",       detalle:"Engrase completo. Km: 209.369"},
    {fecha:"2025-08-07", tipo:"CORRECTIVA", detalle:"Cambio cruceta (usada). Pendiente del mes anterior."},
    {fecha:"2025-09-28", tipo:"CORRECTIVA", detalle:"Embalado completo, cambio cruceta, relleno coronas, 4 retenes maza, 4 chicharras freno, 3 bujes excéntrica. Km: 210.117"},
    {fecha:"2025-10-14", tipo:"CORRECTIVA", detalle:"Cambio válvula de la tolva. Km: 210.454"},
    {fecha:"2025-11-04", tipo:"OTRO",       detalle:"Km: 210.514 / Hr: 15.535"},
    {fecha:"2026-02-05", tipo:"OTRO",       detalle:"Engrase completo. Hr: 15.645 / Km: 211.656"},
    {fecha:"2026-03-19", tipo:"PREVENTIVA", detalle:"Cambio filtro de aire. Hr: 15.692 / Km: 212.125"},
  ],
  "RKSC-25": [
    {fecha:"2022-06-22", tipo:"PREVENTIVA", detalle:"Cambio de aceite. Km: 20.285"},
    {fecha:"2022-12-16", tipo:"OTRO",       detalle:"Km: 30.142"},
    {fecha:"2023-03-17", tipo:"OTRO",       detalle:"Sopletear filtro de aire y engrase completo. Hr: 2.919 / Km: 35.448"},
    {fecha:"2023-04-13", tipo:"OTRO",       detalle:"Km: 36.569 / Hr: 3.002"},
    {fecha:"2023-04-18", tipo:"OTRO",       detalle:"Km: 36.882 / Hr: 3.025"},
    {fecha:"2023-04-26", tipo:"PREVENTIVA", detalle:"Cambio de aceite. Km: 37.118 / Hr: 3.078"},
    {fecha:"2023-07-12", tipo:"PREVENTIVA", detalle:"Cambio de aceite. Km: 39.936 / Hr: 3.495"},
    {fecha:"2023-10-12", tipo:"CORRECTIVA", detalle:"Cambio neumático delantero"},
    {fecha:"2023-10-14", tipo:"CORRECTIVA", detalle:"Mantención Pto. Montt: cambio servo embrague, sensores ABS"},
    {fecha:"2023-10-20", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2023-10-23", tipo:"CORRECTIVA", detalle:"Destapar placa servo, estaba asulfatada y oxidada, limpia contacto"},
    {fecha:"2023-10-24", tipo:"OTRO",       detalle:"Hr: 4.003 / Km: 44.860"},
    {fecha:"2023-11-03", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + filtros, reapriete abrazaderas delanteras. Hr: 4.067 / Km: 45.647. Nota: se trizó máscara delantera de don César"},
    {fecha:"2023-11-07", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2023-11-10", tipo:"CORRECTIVA", detalle:"Desarme embrague y mantención (don Rigo)"},
    {fecha:"2023-11-14", tipo:"OTRO",       detalle:"Hr: 4.103 / Km: 45.933"},
    {fecha:"2023-11-17", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2023-12-04", tipo:"CORRECTIVA", detalle:"Cambio de flexible"},
    {fecha:"2023-12-20", tipo:"OTRO",       detalle:"Km: 47.661 / Hr: 4.288"},
    {fecha:"2024-01-04", tipo:"OTRO",       detalle:"Km: 48.420 / Hr: 4.363"},
    {fecha:"2024-01-05", tipo:"OTRO",       detalle:"Engrase total"},
    {fecha:"2024-01-09", tipo:"OTRO",       detalle:"Km: 48.753 / Hr: 4.386"},
    {fecha:"2024-01-11", tipo:"OTRO",       detalle:"Km: 49.000 / Hr: 4.403"},
    {fecha:"2024-01-12", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-01-22", tipo:"CORRECTIVA", detalle:"Cambio hoja paquete delantero lado derecho"},
    {fecha:"2024-01-24", tipo:"OTRO",       detalle:"Hr: 4.466 / Km: 49.597"},
    {fecha:"2024-01-26", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-01-31", tipo:"PREVENTIVA", detalle:"Cambio filtro de aire. Hr: 4.507"},
    {fecha:"2024-02-07", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-02-09", tipo:"PREVENTIVA", detalle:"Cambio de aceite (mantención preventiva). Hr: 4.564 / Km: 50.566"},
    {fecha:"2024-02-26", tipo:"CORRECTIVA", detalle:"Cambio protector de hojas"},
    {fecha:"2024-03-21", tipo:"OTRO",       detalle:"Km: 51.359 / Hr: 4.649"},
    {fecha:"2024-04-05", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-04-09", tipo:"OTRO",       detalle:"Km: 52.219 / Hr: 4.737"},
    {fecha:"2024-04-12", tipo:"OTRO",       detalle:"Hr: 4.766 / Km: 52.549"},
    {fecha:"2024-04-17", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-05-07", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-05-24", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-05-30", tipo:"OTRO",       detalle:"Km: 54.219 / Hr: 4.982"},
    {fecha:"2024-06-17", tipo:"PREVENTIVA", detalle:"Cambio hoja resorte paquete delantero, refuerzo ambos paquetes. Cambio de aceite. Cambio servo embrague. Hr: 5.018"},
    {fecha:"2024-06-24", tipo:"OTRO",       detalle:"Km: 54.716 / Hr: 5.035"},
    {fecha:"2024-07-12", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-07-19", tipo:"OTRO",       detalle:"Hr: 5.134 / Km: 55.416"},
    {fecha:"2024-07-25", tipo:"OTRO",       detalle:"Hr: 5.167 / Km: 55.686"},
    {fecha:"2024-07-26", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-08-10", tipo:"CORRECTIVA", detalle:"Cambio soporte tensor correa"},
    {fecha:"2024-08-26", tipo:"CORRECTIVA", detalle:"Cambio base tensor V doble puente"},
    {fecha:"2024-08-27", tipo:"OTRO",       detalle:"Hr: 5.241 / Km: 56.243"},
    {fecha:"2024-09-05", tipo:"OTRO",       detalle:"Perfil de tolva modificado, quedó de 14m³"},
    {fecha:"2024-09-06", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-09-10", tipo:"OTRO",       detalle:"Hr: 5.301 / Km: 56.712"},
    {fecha:"2024-09-25", tipo:"OTRO",       detalle:"Hr: 5.338 / Km: 56.960"},
    {fecha:"2024-09-27", tipo:"CORRECTIVA", detalle:"Cambio neumático delantero"},
    {fecha:"2024-10-07", tipo:"PREVENTIVA", detalle:"Cambio de aceite (mantención preventiva). Hr: 5.380"},
    {fecha:"2024-10-11", tipo:"OTRO",       detalle:"Engrase completo. Hr: 5.423"},
    {fecha:"2024-10-17", tipo:"OTRO",       detalle:"Engrase completo. Hr: 5.462 / Km: 58.016"},
    {fecha:"2024-10-25", tipo:"OTRO",       detalle:"Engrase completo. Hr: 5.497"},
    {fecha:"2024-11-07", tipo:"OTRO",       detalle:"Km: 58.889 / Hr: 5.559"},
    {fecha:"2024-11-08", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-11-15", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-11-22", tipo:"OTRO",       detalle:"Engrase completo. Hr: 5.645 / Km: 59.752"},
    {fecha:"2024-11-29", tipo:"OTRO",       detalle:"Engrase completo. Hr: 5.692"},
    {fecha:"2024-12-06", tipo:"OTRO",       detalle:"Engrase completo. Hr: 5.733"},
    {fecha:"2024-12-10", tipo:"PREVENTIVA", detalle:"Cambio de aceite. Hr: 5.741 / Km: 60.621"},
    {fecha:"2024-12-23", tipo:"OTRO",       detalle:"Engrase completo. Hr: 5.816"},
    {fecha:"2025-01-17", tipo:"OTRO",       detalle:"Engrase completo. Hr: 5.945"},
    {fecha:"2025-01-17", tipo:"CORRECTIVA", detalle:"Reapriete pernos tensores suspensión puerta trasera"},
    {fecha:"2025-03-08", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + filtros. Hr: 6.074 / Km: 63.686"},
    {fecha:"2025-03-14", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2025-03-21", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2025-04-21", tipo:"GENERAL",    detalle:"Cambio aceite diferencial 85W-140 (20L x diferencial, 40L total) + caja de cambios 75W-80 10L. Hr: 6.289 / Km: 65.787"},
    {fecha:"2025-05-11", tipo:"PREVENTIVA", detalle:"Cambio de aceite. Hr: 6.390 / Km: 66.483"},
    {fecha:"2025-05-19", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2025-05-20", tipo:"OTRO",       detalle:"Km: 66.824 / Hr: 6.436"},
    {fecha:"2025-05-30", tipo:"CORRECTIVA", detalle:"Cambio 3 hojas resorte más perno centro. Hr: 6.468 / Km: 67.034"},
    {fecha:"2025-06-02", tipo:"CORRECTIVA", detalle:"Reparación hojas quebradas paquete delantero izquierdo"},
    {fecha:"2025-06-13", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2025-07-08", tipo:"OTRO",       detalle:"Km: 68.206 / Hr: 6.637"},
    {fecha:"2025-08-11", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 15W-40 40L + filtros. Reapriete abrazaderas."},
    {fecha:"2025-08-19", tipo:"CORRECTIVA", detalle:"Suelta abrazaderas para acomodar hoja resorte"},
    {fecha:"2025-08-29", tipo:"CORRECTIVA", detalle:"Extracción 2 paquetes resortes, modificación y reemplazo curvas. Soporte candado chasis. Hr: 6.933 / Km: 23.560"},
    {fecha:"2025-09-29", tipo:"CORRECTIVA", detalle:"Cambio agujeta (ilegible) paquete delantero ambos lados. Hojas curvadas colocadas."},
    {fecha:"2025-09-30", tipo:"OTRO",       detalle:"Km: 69.509 / Hr: 6.782"},
    {fecha:"2025-10-06", tipo:"OTRO",       detalle:"Engrase total. Km: 71.328 / Hr: 6.934"},
    {fecha:"2025-10-26", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 15W-40 38L + filtros. 5 pernos rueda. Hr: 7.217 / Km: 72.174"},
    {fecha:"2025-11-17", tipo:"CORRECTIVA", detalle:"Embalado completo, 4 pernos rueda, cambio V soporte puente trasero. Hr: 7.110"},
    {fecha:"2026-01-08", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 15W-40 35L + filtros. Hr: 7.310 / Km: 75.970"},
    {fecha:"2026-01-26", tipo:"OTRO",       detalle:"Eliminación Ad Blue. Hr: 7.374 / Km: 76.926"},
    {fecha:"2026-03-05", tipo:"GENERAL",    detalle:"Cambio aceite hidráulico tolva ISO 68, 65L"},
    {fecha:"2026-03-09", tipo:"CORRECTIVA", detalle:"Cambio hoja resorte paquete delantero. Hr: 7.491"},
    {fecha:"2026-03-24", tipo:"OTRO",       detalle:"Km: 80.321 / Hr: 7.589"},
    {fecha:"2026-04-02", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 15W-40 34L + filtros. Hr: 8.091"},
  ],
  "RHGC-83": [
    {fecha:"2023-03-17", tipo:"OTRO",       detalle:"Engrase completo. Hr: 2.999"},
    {fecha:"2023-03-30", tipo:"OTRO",       detalle:"Engrase completo. Hr: 3.047 / Km: 41.097"},
    {fecha:"2023-04-11", tipo:"OTRO",       detalle:"Engrase completo. Hr: 3.102 / Km: 42.021"},
    {fecha:"2023-04-20", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2023-05-05", tipo:"CORRECTIVA", detalle:"Cambio neumáticos traseros por delanteros"},
    {fecha:"2023-05-11", tipo:"CORRECTIVA", detalle:"Cambio neumáticos delanteros por nuevos. Hr: 3.192 / Km: 42.877"},
    {fecha:"2023-05-16", tipo:"OTRO",       detalle:"Engrase completo. Hr: 3.218 / Km: 43.272"},
    {fecha:"2023-05-30", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2023-06-13", tipo:"OTRO",       detalle:"Engrase completo. Hr: 3.355 / Km: 44.039"},
    {fecha:"2023-06-20", tipo:"PREVENTIVA", detalle:"Cambio aceite y filtros. Hr: 3.380 / Km: 44.163"},
    {fecha:"2023-06-30", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2023-07-10", tipo:"OTRO",       detalle:"Engrase completo. Hr: 3.484 / Km: 44.689"},
    {fecha:"2023-07-17", tipo:"OTRO",       detalle:"Engrase completo. Hr: 3.530 / Km: 44.949"},
    {fecha:"2023-07-27", tipo:"OTRO",       detalle:"Engrase completo. Hr: 3.593 / Km: 45.468"},
    {fecha:"2023-09-25", tipo:"OTRO",       detalle:"Engrase completo. Hr: 3.880 / Km: 48.498"},
    {fecha:"2023-09-28", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 15W-40 38L. Hr: 3.910 / Km: 48.928"},
    {fecha:"2023-11-15", tipo:"CORRECTIVA", detalle:"Engrase completo, cambio de radiador. Hr: 3.944 / Km: 49.280"},
    {fecha:"2023-11-28", tipo:"OTRO",       detalle:"Engrase completo. Hr: 4.009 / Km: 50.840"},
    {fecha:"2023-12-22", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-01-31", tipo:"PREVENTIVA", detalle:"Cambio de filtro. Hr: 4.322"},
    {fecha:"2024-02-07", tipo:"OTRO",       detalle:"Engrase completo. Hr: 4.360 / Km: 53.570"},
    {fecha:"2024-02-26", tipo:"PREVENTIVA", detalle:"Cambio de aceite. Hr: 4.446 / Km: 54.353"},
    {fecha:"2024-03-11", tipo:"CORRECTIVA", detalle:"Mantención del servo y engrase completo. Hr: 4.517 / Km: 55.011"},
    {fecha:"2024-04-30", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-07-25", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-07-26", tipo:"CORRECTIVA", detalle:"Cambio pernos masa trasera"},
    {fecha:"2024-08-13", tipo:"OTRO",       detalle:"Engrase completo. Hr: 4.940 / Km: 58.622"},
    {fecha:"2024-08-14", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 38L. Hr: 4.947 / Km: 58.648"},
    {fecha:"2024-09-26", tipo:"OTRO",       detalle:"Engrase completo. Hr: 5.105 / Km: 59.667"},
    {fecha:"2024-10-10", tipo:"OTRO",       detalle:"Engrase completo. Hr: 5.179 / Km: 60.235"},
    {fecha:"2024-10-17", tipo:"OTRO",       detalle:"Engrase completo. Hr: 5.219 / Km: 60.526"},
    {fecha:"2024-10-23", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + filtros. Hr: 5.250 / Km: 60.804"},
    {fecha:"2024-11-07", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-11-15", tipo:"CORRECTIVA", detalle:"Engrase completo, cambio flexible escape, revisión técnica. Hr: 5.351 / Km: 61.766"},
    {fecha:"2024-11-21", tipo:"OTRO",       detalle:"Engrase completo. Hr: 5.390 / Km: 62.223"},
    {fecha:"2024-11-28", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2024-12-12", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + filtros"},
    {fecha:"2024-12-26", tipo:"OTRO",       detalle:"Engrase completo. Hr: 5.520 / Km: 63.616"},
    {fecha:"2025-01-02", tipo:"OTRO",       detalle:"Engrase completo. Hr: 5.552 / Km: 64.062"},
    {fecha:"2025-01-07", tipo:"PREVENTIVA", detalle:"Cambio de aceite. Hr: 5.573 / Km: 64.167"},
    {fecha:"2025-01-09", tipo:"OTRO",       detalle:"Engrase completo. Hr: 5.589 / Km: 64.289"},
    {fecha:"2025-01-16", tipo:"OTRO",       detalle:"Engrase completo. Hr: 5.636 / Km: 64.776"},
    {fecha:"2025-01-17", tipo:"CORRECTIVA", detalle:"Reapriete cañería toma de fuerza"},
    {fecha:"2025-02-06", tipo:"OTRO",       detalle:"Engrase completo. Hr: 5.675 / Km: 65.163"},
    {fecha:"2025-02-14", tipo:"OTRO",       detalle:"Engrase completo. Hr: 5.720 / Km: 65.410"},
    {fecha:"2025-03-03", tipo:"OTRO",       detalle:"Camión en panne hasta 07-03-2025"},
    {fecha:"2025-03-06", tipo:"CORRECTIVA", detalle:"Colocación soporte diferencial tensores puente trasero"},
    {fecha:"2025-03-14", tipo:"OTRO",       detalle:"Engrase completo. Hr: 5.821 / Km: 65.891"},
    {fecha:"2025-03-21", tipo:"OTRO",       detalle:"Engrase completo. Hr: 5.863 / Km: 66.502"},
    {fecha:"2025-03-28", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + filtros. Hr: 5.898 / Km: 66.708"},
    {fecha:"2025-04-07", tipo:"GENERAL",    detalle:"Cambio aceite ambos diferenciales + cambio 1 hoja resorte delantera. Hr: 5.931 / Km: 67.063"},
    {fecha:"2025-04-14", tipo:"CORRECTIVA", detalle:"Cambio gomas barra estabilizadora delantera. Engrase completo. Hr: 5.955 / Km: 67.230"},
    {fecha:"2025-04-24", tipo:"CORRECTIVA", detalle:"Neumáticos traseros por delanteros, delanteros nuevos. Hr: 5.995 / Km: 67.471"},
    {fecha:"2025-05-19", tipo:"OTRO",       detalle:"Engrase completo. Hr: 6.101 / Km: 68.444"},
    {fecha:"2025-06-02", tipo:"OTRO",       detalle:"Engrase completo. Hr: 6.169 / Km: 68.488"},
    {fecha:"2025-06-06", tipo:"PREVENTIVA", detalle:"Cambio de aceite. Hr: 6.200 / Km: 69.020"},
    {fecha:"2025-06-12", tipo:"OTRO",       detalle:"Engrase completo. Hr: 6.224 / Km: 69.166"},
    {fecha:"2025-06-18", tipo:"GENERAL",    detalle:"Cambio aceite cubos reductores. Hr: 6.251 / Km: 69.304"},
    {fecha:"2025-06-19", tipo:"OTRO",       detalle:"Engrase completo. Hr: 6.258 / Km: 69.354"},
    {fecha:"2025-07-04", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2025-07-10", tipo:"OTRO",       detalle:"Engrase completo. Hr: 6.358 / Km: 70.078"},
    {fecha:"2025-07-18", tipo:"OTRO",       detalle:"Engrase completo. Hr: 6.385 / Km: 70.226"},
    {fecha:"2025-08-11", tipo:"CORRECTIVA", detalle:"Cambio hoja resorte quebrada, refuerzo 2 paquetes delanteros. Hr: 6.449 / Km: 71.011"},
    {fecha:"2025-08-19", tipo:"OTRO",       detalle:"Engrase completo. Hr: 6.495 / Km: 71.549"},
    {fecha:"2025-08-25", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 15W-40 38L. Hr: 6.520 / Km: 71.874"},
    {fecha:"2025-08-28", tipo:"OTRO",       detalle:"Engrase completo. Hr: 6.548 / Km: 72.300"},
    {fecha:"2025-09-04", tipo:"OTRO",       detalle:"Engrase completo. Hr: 6.591 / Km: 72.641"},
    {fecha:"2025-10-21", tipo:"OTRO",       detalle:"Engrase completo. Hr: 6.788 / Km: 75.255"},
    {fecha:"2025-10-27", tipo:"PREVENTIVA", detalle:"Mantención preventiva. Hr: 6.814 / Km: 75.622"},
    {fecha:"2025-10-30", tipo:"CORRECTIVA", detalle:"Engrase completo, mantención balatas, cambio aceite tensor. Hr: 6.821 / Km: 75.633"},
    {fecha:"2025-11-12", tipo:"CORRECTIVA", detalle:"Embalado completo, 2 neumáticos nuevos, cambio V suspensión puente medio, 2 pernos rueda."},
    {fecha:"2025-11-21", tipo:"OTRO",       detalle:"Engrase completo. Hr: 6.882 / Km: 76.761"},
    {fecha:"2025-12-01", tipo:"OTRO",       detalle:"Engrase completo. Hr: 6.920 / Km: 77.260"},
    {fecha:"2025-12-11", tipo:"OTRO",       detalle:"Engrase completo. Hr: 6.966 / Km: 77.912"},
    {fecha:"2026-01-19", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 15W-40 34L + filtros. Hr: 7.137 / Km: 80.571"},
    {fecha:"2026-02-19", tipo:"CORRECTIVA", detalle:"Cambio 2 neumáticos delanteros. Hr: 7.450 / Km: 85.800"},
    {fecha:"2026-02-24", tipo:"CORRECTIVA", detalle:"Cambio 2 hojas de resorte y revisión total por ruidos de frenado"},
    {fecha:"2026-02-25", tipo:"GENERAL",    detalle:"Cambio aceite hidráulico levante tolva ISO 68, 60L. Hr: 7.467 / Km: 86.008"},
    {fecha:"2026-03-21", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 15W-40 35L + filtros. Hr: 7.457 / Km: 85.855"},
    {fecha:"2026-03-30", tipo:"CORRECTIVA", detalle:"Cambio hoja resorte delantera izquierda, perno centro y abrazaderas. Hr: 7.482 / Km: 86.214"},
  ],
  "SW-6114": [
    {fecha:"2025-01-14", tipo:"PREVENTIVA", detalle:"Cambio 3 filtros petróleo, limpieza chupador estanque petróleo."},
  ],
  "HDWS-49": [
    {fecha:"2023-03-23", tipo:"GENERAL",    detalle:"Reparación reductor de giro: rodamiento superior, retén aceite, conjunto planetario, piñón central inferior. Aceite 85W-140. Cambio aceite hidráulico SAE 68 con todos los filtros. Hr: 10.466"},
    {fecha:"2023-03-27", tipo:"OTRO",       detalle:"Listado reparaciones pendientes: bujes/pasadores balde, cilindros gemelas, marcador combustible, tapas batería, pisadera, radio, AC, katalinas rueda motriz, pérdida aceite mandos cabina. Hr: 10.468"},
    {fecha:"2023-03-30", tipo:"CORRECTIVA", detalle:"Cambio puntillas nuevas de balde. Hr: 10.494"},
    {fecha:"2023-07-03", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + relleno aceite hidráulico SAE 68. Hr: 10.672"},
    {fecha:"2023-10-07", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + filtros completos. Hr: 10.933"},
    {fecha:"2025-12-12", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 15W-40 23L + filtros. Hr: 11.181"},
    {fecha:"2026-01-28", tipo:"CORRECTIVA", detalle:"Cambio calzas balde N°103352TL. Hr: 11.275"},
  ],
  "LVGS-87": [
    {fecha:"2023-03-20", tipo:"OTRO",       detalle:"Engrase completo. Pendiente: bujes/pasadores botellas, gemelas, balde, cambio aceite hidráulico, mandos finales. Hr: 5.271"},
    {fecha:"2023-04-03", tipo:"GENERAL",    detalle:"Cambio aceite mandos finales y reductor de giro 85W-140. Hr: 5.307"},
    {fecha:"2023-04-17", tipo:"GENERAL",    detalle:"Cambio aceite hidráulico con filtros. Hr: 5.326"},
    {fecha:"2023-04-18", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + filtros combustible y aire. Hr: 5.331"},
    {fecha:"2023-05-18", tipo:"CORRECTIVA", detalle:"Cambio puntillas balde"},
    {fecha:"2023-07-03", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + filtros. Hr: 5.651"},
    {fecha:"2023-09-29", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + filtros. Hr: 5.900"},
    {fecha:"2023-12-14", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + filtros. Hr: 6.169"},
    {fecha:"2024-02-12", tipo:"CORRECTIVA", detalle:"Ajuste conjunto balde con lainas. Soldadura 3 fisuras costado rodillos superiores carro. Limpieza cabina, pernos asiento. Reapriete filtro petróleo. Limpieza caja corriente. Sopleteo filtro y rejilla radiador. Desmontaje ruedas tensoras por mal estado."},
    {fecha:"2024-02-21", tipo:"CORRECTIVA", detalle:"Montaje ruedas tensoras ambos lados. Limpieza válvulas graseras tensores. Cambio puntillas graseras botellas. Cambio ampolletas foco derecho."},
    {fecha:"2024-03-06", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + filtros. Hr: 6.433"},
    {fecha:"2024-05-10", tipo:"PREVENTIVA", detalle:"Mantención 250 hr. Cambio aceite motor + filtros aceite, petróleo y aire. Hr: 6.712"},
    {fecha:"2024-06-10", tipo:"PREVENTIVA", detalle:"Mantención preventiva. Hr: 6.977"},
    {fecha:"2024-09-11", tipo:"CORRECTIVA", detalle:"Cambio calzas N°103352TL. Desgaste diámetro exterior seguro pasadores. Hr: 7.152"},
    {fecha:"2025-02-06", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + filtros. Hr: 7.429"},
    {fecha:"2025-07-12", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 15W-40 22L + filtros. Hr: 7.745"},
    {fecha:"2025-09-16", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 15W-40 23L + filtros. Hr: 8.088. Pendiente: filtro hidráulico, pilotaje, aceite 80W-90 traslación."},
    {fecha:"2025-10-02", tipo:"GENERAL",    detalle:"Completado pendiente: filtro hidráulico, filtro pilotaje, aceite 80W-90 motores traslación 30L."},
    {fecha:"2025-12-15", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 15W-40 23L + filtros. Hr: 8.266"},
  ],
  "TCCW-19": [
    {fecha:"2024-02-13", tipo:"CORRECTIVA", detalle:"Cambio sensor nivel combustible. Constancia juego pasador base boom. Hr: 451"},
    {fecha:"2024-03-06", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + filtros (aceite, petróleo, piloto, aire, AC interior/exterior). Hr: 563"},
    {fecha:"2024-03-11", tipo:"CORRECTIVA", detalle:"Cambio puntillas balde con seguros y pasadores nuevos. Hr: 581"},
    {fecha:"2024-05-06", tipo:"CORRECTIVA", detalle:"Cambio puntillas balde. Hr: 869"},
    {fecha:"2024-05-10", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + filtro aire. Pendiente filtro petróleo. Hr: 895"},
    {fecha:"2024-06-02", tipo:"GENERAL",    detalle:"Mantención 1.000 hr. Cambio filtros aire primario/secundario, aceite motor, hidráulico retorno, combustible, respiradero hidráulico, AC interior/exterior, separador agua, pilotaje/freno. Correas ventilador y AC. Aceite motor 15W-40 30L, giro 80-90 8L, reductores 80-90 12L. Regulación válvulas motor. Hr: 1.114"},
    {fecha:"2024-06-12", tipo:"CORRECTIVA", detalle:"Cambio calzas balde con seguro y pasadores. Hr: 1.169"},
    {fecha:"2024-09-07", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + filtros combustible y aire. Hr: 1.451"},
    {fecha:"2024-09-23", tipo:"CORRECTIVA", detalle:"Relleno aceite hidráulico SAE 68 6L"},
    {fecha:"2024-11-11", tipo:"GENERAL",    detalle:"Mantención general. Hr: 1.748"},
    {fecha:"2024-12-10", tipo:"CORRECTIVA", detalle:"Cambio 5 calzas nuevas con seguro y pasadores. Hr: 1.890"},
    {fecha:"2025-01-10", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 15W-40 38L + filtros (aceite, combustible, aire). Hr: 2.029"},
    {fecha:"2025-01-20", tipo:"CORRECTIVA", detalle:"Cambio calzas con pasadores y seguros. Hr: 2.076"},
    {fecha:"2025-01-27", tipo:"GENERAL",    detalle:"Mantención general completa. Hr: 2.099"},
    {fecha:"2025-04-01", tipo:"CORRECTIVA", detalle:"Cambio calzas balde con pasadores y seguros. Hr: 2.312"},
    {fecha:"2025-04-04", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + filtros combustible y aire. Hr: 2.330"},
    {fecha:"2025-06-16", tipo:"CORRECTIVA", detalle:"Cambio 5 puntillas balde. Cambio corona de giro nueva tras revisión DEVELON por golpeteo. Hr: 2.571"},
    {fecha:"2025-06-23", tipo:"CORRECTIVA", detalle:"Cambio bomba de giro nueva y componentes bomba hidráulica (técnicos DEVELON). Equipo sigue con golpe en giro. Hr: 2.600"},
    {fecha:"2025-06-28", tipo:"PREVENTIVA", detalle:"Mantención preventiva. Hr: 2.625"},
    {fecha:"2025-07-26", tipo:"CORRECTIVA", detalle:"Cambio 5 puntillas balde con seguro y pasador. Hr: 2.753"},
    {fecha:"2025-09-08", tipo:"PREVENTIVA", detalle:"Mantención preventiva. Hr: 2.906"},
    {fecha:"2025-11-10", tipo:"CORRECTIVA", detalle:"Reparación balde: cambio fondo, refuerzo cuchillas, soldadura planchas laterales. Hr: 3.197"},
    {fecha:"2025-11-13", tipo:"PREVENTIVA", detalle:"Mantención preventiva. Hr: 3.214"},
    {fecha:"2026-01-22", tipo:"GENERAL",    detalle:"Cambio aceite motor 15W-40 35L + filtros. Hr: 3.510"},
    {fecha:"2026-04-02", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 15W-40 32L + filtros. Hr: 3.852"},
  ],
  "LXDT-19": [
    {fecha:"2023-03-17", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + filtros (aceite, petróleo y aire). Hr: 5.157"},
    {fecha:"2023-07-21", tipo:"PREVENTIVA", detalle:"Mantención preventiva. Hr: 5.375"},
    {fecha:"2023-08-08", tipo:"GENERAL",    detalle:"Cambio aceite hidráulico con filtro. Hr: 5.405"},
    {fecha:"2023-10-03", tipo:"GENERAL",    detalle:"Cambio aceite ambos ejes delanteros y traseros. Aceite Mobil Fluid 424. Hr: 5.506"},
    {fecha:"2023-11-23", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + filtros. Hr: 5.649"},
    {fecha:"2023-12-19", tipo:"CORRECTIVA", detalle:"Reparación articulación central: 4 rodamientos N°33115, 4 retenes, engrase completo. Hr: 5.714"},
    {fecha:"2024-02-09", tipo:"PREVENTIVA", detalle:"Mantención preventiva. Hr: 5.902"},
    {fecha:"2024-02-27", tipo:"CORRECTIVA", detalle:"Cambio filtro aire acondicionado. Hr: 5.965"},
    {fecha:"2024-07-10", tipo:"PREVENTIVA", detalle:"Mantención preventiva. Hr: 6.160"},
    {fecha:"2024-10-03", tipo:"PREVENTIVA", detalle:"Mantención preventiva. Hr: 6.281"},
    {fecha:"2024-10-31", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + filtros. Hr: 6.424"},
    {fecha:"2025-01-03", tipo:"CORRECTIVA", detalle:"Cambio cuchillas. Hr: 6.661"},
    {fecha:"2025-01-10", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + filtros (aceite, petróleo, aire, decantadores). Hr: 6.690"},
    {fecha:"2025-01-13", tipo:"GENERAL",    detalle:"Cambio aceite eje diferencial delantero. Hr: 6.691"},
    {fecha:"2025-04-14", tipo:"GENERAL",    detalle:"Cambio aceite eje diferencial delantero. Hr: 6.862"},
    {fecha:"2025-04-24", tipo:"GENERAL",    detalle:"Cambio aceite eje diferencial trasero 10W-30 Unitractor. Hr: 6.898"},
    {fecha:"2025-05-19", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 15W-40 + filtros. Hr: 6.988"},
    {fecha:"2025-07-19", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 15W-40 18L + filtros. Hr: 7.231"},
    {fecha:"2025-11-05", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 15W-40 19L + filtros."},
    {fecha:"2025-12-05", tipo:"GENERAL",    detalle:"Cambio aceite hidráulico 180L tipo 46 + filtros hidráulicos. Hr: 7.544"},
  ],
  "SDTP-59": [
    {fecha:"2023-03-17", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + filtros (motor, petróleo, aire), engrase completo. Hr: 755"},
    {fecha:"2023-03-20", tipo:"OTRO",       detalle:"Engrase balde y perno centro"},
    {fecha:"2023-03-21", tipo:"OTRO",       detalle:"Engrase balde y perno centro"},
    {fecha:"2023-03-22", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2023-03-23", tipo:"OTRO",       detalle:"Engrase balde, perno centro y sopleteo filtro"},
    {fecha:"2023-03-24", tipo:"OTRO",       detalle:"Engrase completo"},
    {fecha:"2023-04-10", tipo:"OTRO",       detalle:"Hr: 890"},
    {fecha:"2023-06-09", tipo:"PREVENTIVA", detalle:"Cambio de aceite y filtros. Hr: 1.267"},
    {fecha:"2023-07-21", tipo:"PREVENTIVA", detalle:"Cambio de aceite. Hr: 1.533"},
    {fecha:"2023-09-01", tipo:"PREVENTIVA", detalle:"Mantención preventiva. Hr: 1.750"},
    {fecha:"2023-10-17", tipo:"GENERAL",    detalle:"Mantención general: cambio aceite motor 15W-40 26L + aceite ejes AXO80 48L. Hr: 2.086"},
    {fecha:"2023-10-18", tipo:"GENERAL",    detalle:"Cambio aceite hidráulico 89L. Hr: 2.101"},
    {fecha:"2023-11-23", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + filtros. Hr: 2.326"},
    {fecha:"2023-12-06", tipo:"PREVENTIVA", detalle:"Cambio filtro de petróleo. Hr: 2.416"},
    {fecha:"2024-01-10", tipo:"GENERAL",    detalle:"Mantención general. Hr: 2.597"},
    {fecha:"2024-02-19", tipo:"GENERAL",    detalle:"Mantención general. Hr: 2.849"},
    {fecha:"2024-02-23", tipo:"CORRECTIVA", detalle:"Cambio de cuchilla. Hr: 2.884"},
    {fecha:"2024-04-17", tipo:"PREVENTIVA", detalle:"Mantención preventiva. Hr: 3.105"},
    {fecha:"2024-06-04", tipo:"PREVENTIVA", detalle:"Mantención preventiva. Hr: 3.358"},
    {fecha:"2024-07-19", tipo:"PREVENTIVA", detalle:"Mantención preventiva. Hr: 3.608"},
    {fecha:"2024-09-05", tipo:"PREVENTIVA", detalle:"Mantención preventiva. Hr: 3.873"},
    {fecha:"2024-10-31", tipo:"GENERAL",    detalle:"Mantención general: aceite motor 15W-40 26L + ejes (424) 48L + hidráulico 10W 89L. + transmisión hidráulica + corona delantera. Hr: 4.150"},
    {fecha:"2024-12-23", tipo:"PREVENTIVA", detalle:"Mantención preventiva, pendiente filtro primario. Hr: 4.457"},
    {fecha:"2025-02-08", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + filtros. Hr: 4.722"},
    {fecha:"2025-03-25", tipo:"PREVENTIVA", detalle:"Mantención preventiva, se voltea cuchilla. Hr: 4.997"},
    {fecha:"2025-05-12", tipo:"PREVENTIVA", detalle:"Mantención preventiva. Hr: 5.268"},
    {fecha:"2025-06-30", tipo:"PREVENTIVA", detalle:"Mantención preventiva. Hr: 5.548"},
    {fecha:"2025-07-22", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 15W-40 23L + filtros. Hr: 5.795"},
    {fecha:"2025-10-05", tipo:"GENERAL",    detalle:"Mantención general: aceite motor 15W-40 + mandos finales 10W-30 60L + transmisión 10W-30 8L + hidráulico 80W-90 90L. Hr: 6.036"},
    {fecha:"2025-11-30", tipo:"PREVENTIVA", detalle:"Mantención preventiva. Hr: 6.355"},
    {fecha:"2026-01-22", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 15W-40 24L + filtros. Hr: 6.647"},
    {fecha:"2026-03-07", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 15W-40 24L + filtros. Hr: 6.922"},
    {fecha:"2026-04-20", tipo:"PREVENTIVA", detalle:"Mantención preventiva. Hr: 7.166"},
    {fecha:"2026-04-18", tipo:"PREVENTIVA", detalle:"Cambio aceite motor 15W-40 24L + filtros."},
  ],
  "RHRB-94": [
    {fecha:"2024-10-24", tipo:"PREVENTIVA", detalle:"Cambio aceite motor + filtros"},
    {fecha:"2025-01-06", tipo:"CORRECTIVA", detalle:"Cambio 2 rótulas bandeja, 2 rodamientos maza delantera, traslado 2 neumáticos. Pastillas traseras y delanteras."},
    {fecha:"2025-08-13", tipo:"CORRECTIVA", detalle:"Cambio correa accesorios motor, compresor AC, carga líquido refrigerante. Km: 132.830"},
    {fecha:"2025-09-08", tipo:"CORRECTIVA", detalle:"Cambio correa ventilación y polea. Mantención alternador. Cambio polea guía accesorio. Km: 133.188"},
    {fecha:"2025-12-21", tipo:"CORRECTIVA", detalle:"Cambio rótulas inferiores y rodamientos maza. Km: 139.982"},
    {fecha:"2026-01-19", tipo:"PREVENTIVA", detalle:"Cambio filtro petróleo."},
  ],
};

/* ═══════════════════════ CATEGORÍAS ═══════════════════════ */
const CATEGORIES = [
  {id:"CARGADOR",   label:"Cargadores Frontales", icon:"🚜"},
  {id:"CAMION",     label:"Camiones Tolva",        icon:"🚛"},
  {id:"EXCAVADORA", label:"Excavadoras",           icon:"🏗️"},
  {id:"CAMIONETA",  label:"Camionetas",            icon:"🛻"},
  {id:"GENERADOR",  label:"Generadores",           icon:"⚡"},
  {id:"BATEA",      label:"Bateas",                icon:"📦"},
  {id:"CAMA_BAJA",  label:"Camas Bajas",           icon:"🛤️"},
];

const BRANDS = {
  CAMION:["Mack","Volkswagen","Renault"], CARGADOR:["Komatsu","Hyundai"],
  EXCAVADORA:["Develon","Hyundai"], GENERADOR:["BSG","Hechizo"],
  CAMIONETA:["Maxus","Peugeot"], BATEA:["Randon"], CAMA_BAJA:["Schilger"],
};

function platesFor(cat, marca) {
  if (marca==="Mack")       return ["DFLW-71","DRHK-42","DHXR-54","WY-8717"];
  if (marca==="Volkswagen") return ["RHGC-83","RKSC-25"];
  if (marca==="Renault")    return ["SW-6114"];
  if (marca==="Komatsu")    return ["SDTP-59"];
  if (marca==="Hyundai") {
    if (cat==="CARGADOR")   return ["LXDT-19"];
    if (cat==="EXCAVADORA") return ["LVGS-87","HDWS-49"];
  }
  if (marca==="Develon")  return ["TCCW-19"];
  if (marca==="Maxus")    return ["RHRB-94"];
  if (marca==="Peugeot")  return ["TTVR-19"];
  if (marca==="Randon")   return ["JL-8263"];
  if (marca==="Schilger") return ["JH-4921"];
  return [];
}

const OPERATORS = [
  "Eligio Miranda","Patricio Obando","Salomón Fernández","Segundo Gómez",
  "Fernando Gueicha","Francisco Bahamonde","Pedro Espinoza",
  "Cecilia Sandoval","Ignacio Echeverría"
];

/* ═══════════════════════ UTILS ═══════════════════════ */
function fmt(n,dec=0){if(n==null||Number.isNaN(+n))return"—";const v=Number(n);return(v===0?0:v).toLocaleString("es-CL",{minimumFractionDigits:dec,maximumFractionDigits:dec});}
const todayISO=()=>{const d=new Date();d.setHours(0,0,0,0);const p=n=>String(n).padStart(2,"0");return`${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;};
function parseISO(d){if(!d)return null;const[y,m,da]=String(d).split("-").map(Number);if(!y||!m||!da)return null;const dt=new Date(y,m-1,da);return isNaN(dt)?null:dt;}
function daysBetween(a,b){const A=parseISO(a),B=parseISO(b||todayISO());if(!A||!B)return 0;return Math.round((new Date(B).setHours(0,0,0,0)-new Date(A).setHours(0,0,0,0))/86400000);}
const WS={1:9,2:9,3:9,4:9,5:8,6:0,0:0};
function workHrs(a,b){const A=parseISO(a),B=parseISO(b||todayISO());if(!A||!B)return 0;let t=0;const c=new Date(A);while(c<=B){t+=WS[c.getDay()]||0;c.setDate(c.getDate()+1);}return t;}
function addYears(iso,y=1){const d=parseISO(iso);if(!d)return null;d.setFullYear(d.getFullYear()+y);return d.toISOString().slice(0,10);}
function estadoPorDias(d,h){if(d<=0)return"VENCIDA";if(d<=7)return"URGENTE";if(d<=h)return"PRONTO";return"OK";}

function badgeSt(e){
  if(!e)return{bg:"#e2e8f0",fg:P.txtBody};
  if(e==="VENCIDA")return{bg:P.red,fg:"#fff"};
  if(e==="URGENTE")return{bg:P.orange,fg:"#fff"};
  if(e==="PRONTO") return{bg:P.yellow,fg:P.dark};
  if(e==="OK")     return{bg:P.green,fg:"#fff"};
  return{bg:"#334155",fg:"#fff"};
}
const Badge=({e})=>{
  const s=badgeSt(e);
  return <span style={{background:s.bg,color:s.fg,padding:"3px 10px",borderRadius:8,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.04em",display:"inline-block"}}>{e}</span>;
};

const iBase={width:"100%",padding:"9px 13px",borderRadius:10,border:`2px solid ${P.border}`,background:P.card,color:P.txtTitle,fontSize:14,fontWeight:600,outline:"none",boxSizing:"border-box"};
const Inp=({sx={},...p})=><input style={{...iBase,...sx}} {...p} onFocus={e=>e.target.style.borderColor=P.blue} onBlur={e=>e.target.style.borderColor=P.border}/>;
const Sel=({sx={},children,...p})=><select style={{...iBase,...sx}} {...p}>{children}</select>;
const Lbl=({c=P.txtLabel,children})=><label style={{display:"block",fontSize:11,fontWeight:700,color:c,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:5}}>{children}</label>;
const Sec=({c=P.txtMuted,mb=14,children})=><p style={{fontSize:11,fontWeight:700,color:c,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:mb}}>{children}</p>;
const Btn=({v="primary",sx={},children,...p})=>{
  const vs={
    primary:  {bg:P.blue,  fg:"#fff"},
    secondary:{bg:P.card,  fg:P.txtTitle, border:`2px solid ${P.border}`},
    danger:   {bg:P.red,   fg:"#fff"},
  };
  const s=vs[v]||vs.primary;
  return(
    <button style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,padding:"10px 18px",borderRadius:10,fontWeight:700,fontSize:13,cursor:"pointer",border:s.border||"none",background:s.bg,color:s.fg,...sx}}
      onMouseOver={e=>e.currentTarget.style.opacity="0.85"}
      onMouseOut={e=>e.currentTarget.style.opacity="1"}
      {...p}>{children}</button>
  );
};

/* ═══════════════════════ INSUMOS TABLE ═══════════════════════ */
function InsumosTable({title,value=[],onChange}){
  return(
    <div style={{background:"#f8fafc",border:`2px solid ${P.border}`,borderRadius:14,padding:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <Sec c={P.txtBody} mb={0}>{title}</Sec>
        <button onClick={()=>onChange([...value,{tipo:"Filtro",nombre:"",cant:1,enBodega:false}])}
          style={{fontSize:12,fontWeight:700,color:P.blue,background:"none",border:"none",cursor:"pointer"}}>
          + Agregar
        </button>
      </div>
      {value.length===0&&<p style={{fontSize:12,color:P.txtDim,textAlign:"center",padding:"6px 0",fontStyle:"italic"}}>Sin insumos</p>}
      {value.map((r,i)=>(
        <div key={i} style={{display:"flex",flexWrap:"wrap",gap:6,alignItems:"center",background:P.card,padding:"7px 10px",borderRadius:9,border:`1px solid ${P.border}`,marginBottom:6}}>
          <select value={r.tipo} onChange={e=>onChange(value.map((x,idx)=>idx===i?{...x,tipo:e.target.value}:x))}
            style={{fontSize:11,fontWeight:600,border:"none",background:"#f1f5f9",borderRadius:6,padding:"3px 6px",color:P.txtTitle}}>
            <option>Filtro</option><option>Aceite</option><option>Otro</option>
          </select>
          <input style={{fontSize:12,flex:1,padding:"3px 8px",borderRadius:6,border:`1px solid ${P.border}`,outline:"none",color:P.txtTitle,minWidth:70}}
            placeholder="Descripción..." value={r.nombre}
            onChange={e=>onChange(value.map((x,idx)=>idx===i?{...x,nombre:e.target.value}:x))}/>
          <input type="number" style={{fontSize:12,fontWeight:700,width:42,textAlign:"center",border:`1px solid ${P.border}`,borderRadius:6,padding:"3px",color:P.txtTitle}}
            value={r.cant} onChange={e=>onChange(value.map((x,idx)=>idx===i?{...x,cant:Number(e.target.value)}:x))}/>
          <span style={{fontSize:10,color:P.txtDim,fontWeight:700,width:12}}>{r.tipo==="Aceite"?"L":"un"}</span>
          <label style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer"}}>
            <input type="checkbox" checked={r.enBodega}
              onChange={e=>onChange(value.map((x,idx)=>idx===i?{...x,enBodega:e.target.checked}:x))}/>
            <span style={{fontSize:10,fontWeight:700,color:P.txtMuted,textTransform:"uppercase"}}>Bodega</span>
          </label>
          <button onClick={()=>onChange(value.filter((_,idx)=>idx!==i))}
            style={{color:P.red,background:"none",border:"none",cursor:"pointer",fontWeight:700,fontSize:14}}>✕</button>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════ PANEL ESTADO ═══════════════════════ */
function StatusPanel({s,e,unit,esCamioneta,upd}){
  const esBOC=["BATEA","CAMA_BAJA"].includes(e.categoria);
  const darkInput={...iBase,background:"#1e293b",color:"#ffffff",borderColor:"#334155"};
  const panel={background:P.dark,borderRadius:16,padding:24,boxShadow:"0 4px 20px rgba(0,0,0,0.4)"};

  if(esBOC){
    const estRT=estadoPorDias(daysBetween(todayISO(),addYears(e.rtUltima||todayISO(),1)),30);
    const estPC=estadoPorDias(daysBetween(todayISO(),addYears(e.pcUltimo||todayISO(),1)),30);
    return(
      <div style={panel}>
        <Sec c={P.txtLight}>Control Legal</Sec>
        <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{color:P.txtLight,fontSize:14,fontWeight:600}}>Revisión Técnica</span><Badge e={estRT}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{color:P.txtLight,fontSize:14,fontWeight:600}}>Permiso Circulación</span><Badge e={estPC}/>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div><Lbl c={P.txtLight}>Últ. Revisión Técnica</Lbl>
            <input type="date" value={e.rtUltima||""} onChange={v=>upd({rtUltima:v.target.value})} style={darkInput}/></div>
          <div><Lbl c={P.txtLight}>Últ. Permiso Circulación</Lbl>
            <input type="date" value={e.pcUltimo||""} onChange={v=>upd({pcUltimo:v.target.value})} style={darkInput}/></div>
        </div>
      </div>
    );
  }

  const renderMant=(label,est,prox,rest,onReg)=>(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{color:P.txtLight,fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em"}}>{label}</span>
        <Badge e={est}/>
      </div>
      {!est.includes("LECTURA")&&!est.includes("PREV")&&!est.includes("GEN")?(
        est==="VENCIDA"?(
          <>
            <p style={{fontSize:30,fontWeight:900,color:P.redLight,lineHeight:1,margin:0}}>
              -{fmt(Math.abs(rest))} <span style={{fontSize:13,color:P.redLight}}>{unit}</span>
            </p>
            <p style={{fontSize:11,color:P.redLight,fontWeight:700,marginTop:4,textTransform:"uppercase"}}>
              Debió hacerse a {fmt(prox)} {unit}
            </p>
          </>
        ):(
          <>
            <p style={{fontSize:30,fontWeight:900,color:"#fff",lineHeight:1,margin:0}}>
              {fmt(rest)} <span style={{fontSize:13,color:P.txtDim}}>{unit}</span>
            </p>
            <p style={{fontSize:11,color:P.txtDim,fontWeight:700,marginTop:4,textTransform:"uppercase"}}>
              Restan · próx. a {fmt(prox)} {unit}
            </p>
          </>
        )
      ):(
        <p style={{fontSize:12,color:P.txtDim,fontStyle:"italic",marginTop:4}}>Completar datos para calcular</p>
      )}
      <button onClick={onReg}
        style={{width:"100%",marginTop:10,background:"#14532d",color:"#fff",padding:"9px",borderRadius:9,fontWeight:700,fontSize:11,textTransform:"uppercase",border:"none",cursor:"pointer"}}>
        ✓ Registrar {label.includes("Prev")?"Preventiva":"General"}
      </button>
    </div>
  );

  return(
    <div style={panel}>
      <Sec c={P.txtLight}>Estado de Ciclo</Sec>
      <div style={{display:"flex",flexDirection:"column",gap:20}}>
        {!esCamioneta&&renderMant("Próx. Preventiva",s.estPrev,s.proxPrev,s.restPrev,
          ()=>{if(window.confirm("¿Registrar preventiva realizada?"))upd({ultimaPreventivaHora:s.horaActual});})}
        <div style={!esCamioneta?{borderTop:"1px solid #334155",paddingTop:20}:{}}>
          {renderMant("Próx. General",s.estGen,s.proxGen,s.restGen,
            ()=>{if(window.confirm("¿Registrar general realizada?"))upd({ultimaGeneralHora:s.horaActual});})}
        </div>
        {!["CARGADOR","EXCAVADORA","GENERADOR"].includes(e.categoria)&&(
          <div style={{borderTop:"1px solid #334155",paddingTop:18,display:"flex",flexDirection:"column",gap:10}}>
            <Sec c={P.txtLight}>Documentos Legales</Sec>
            <div>
              <Lbl c={P.txtLight}>Revisión Técnica (últ.)</Lbl>
              <input type="date" value={e.rtUltima||""} onChange={v=>upd({rtUltima:v.target.value})} style={darkInput}/>
              {e.rtUltima&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:5}}>
                <span style={{fontSize:11,color:P.txtDim}}>Vence {addYears(e.rtUltima,1)}</span>
                <Badge e={estadoPorDias(daysBetween(todayISO(),addYears(e.rtUltima,1)),30)}/>
              </div>}
            </div>
            <div>
              <Lbl c={P.txtLight}>Permiso Circulación (últ.)</Lbl>
              <input type="date" value={e.pcUltimo||""} onChange={v=>upd({pcUltimo:v.target.value})} style={darkInput}/>
              {e.pcUltimo&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:5}}>
                <span style={{fontSize:11,color:P.txtDim}}>Vence {addYears(e.pcUltimo,1)}</span>
                <Badge e={estadoPorDias(daysBetween(todayISO(),addYears(e.pcUltimo,1)),30)}/>
              </div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════ HISTORIAL PANEL ═══════════════════════ */
const TIPO_COLORS = {
  PREVENTIVA:{bg:"#dbeafe",fg:"#1d4ed8",label:"Preventiva"},
  GENERAL:   {bg:"#dcfce7",fg:"#166534",label:"General"},
  CORRECTIVA:{bg:"#fff7ed",fg:"#c2410c",label:"Correctiva"},
  OTRO:      {bg:"#f1f5f9",fg:"#475569",label:"Otro"},
};

function HistorialPanel({patente}){
  const items=HISTORIAL[patente];
  if(!items||items.length===0)return null;
  const ordenadas=[...items].sort((a,b)=>new Date(b.fecha)-new Date(a.fecha));
  return(
    <div style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:14,padding:20,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <span style={{fontSize:18}}>📋</span>
        <p style={{fontSize:12,fontWeight:700,color:P.txtLabel,textTransform:"uppercase",letterSpacing:"0.08em",margin:0}}>
          Historial de Intervenciones
        </p>
        <span style={{fontSize:11,color:P.txtDim,fontWeight:500}}>— {ordenadas.length} registros</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {ordenadas.map((item,i)=>{
          const tc=TIPO_COLORS[item.tipo]||TIPO_COLORS.OTRO;
          const fecha=new Date(item.fecha+"T12:00:00").toLocaleDateString("es-CL",{day:"2-digit",month:"2-digit",year:"numeric"});
          return(
            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"9px 12px",background:"#f8fafc",borderRadius:9,border:`1px solid ${P.border}`}}>
              <div style={{flexShrink:0,minWidth:76}}>
                <span style={{fontSize:11,fontWeight:600,color:P.txtMuted}}>{fecha}</span>
              </div>
              <div style={{flexShrink:0}}>
                <span style={{background:tc.bg,color:tc.fg,padding:"2px 8px",borderRadius:6,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.04em"}}>
                  {tc.label}
                </span>
              </div>
              <p style={{fontSize:12,color:P.txtBody,margin:0,lineHeight:1.5}}>{item.detalle}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════ EDITOR EQUIPO ═══════════════════════ */
const RowEditor=memo(function RowEditor({e,calcularEstado,updateEquipo,removeEquipo}){
  const s=calcularEstado(e);
  const upd=p=>updateEquipo(e.id,p);
  const esCam=e.categoria==="CAMIONETA", esCamion=e.categoria==="CAMION";
  const esBOC=["BATEA","CAMA_BAJA"].includes(e.categoria);
  const lbl=esCam?"Odómetro":"Horómetro", unit=esCam?"km":"h";

  const handlePatente=(nueva)=>{
    const m=MAESTRO[nueva];
    if(m){
      upd({patente:nueva,modelo:m.modelo,preventivaCada:m.preventivaCada,generalCada:m.generalCada,
        horaActual:m.horaActual,horaActualFecha:m.horaActualFecha,
        ultimaPreventivaHora:m.ultimaPreventivaHora,ultimaGeneralHora:m.ultimaGeneralHora,
        insumosPrev:[...m.insumosPrev],insumosGen:[...m.insumosGen]});
    } else { upd({patente:nueva}); }
  };

  const restablecer=()=>{
    const m=MAESTRO[e.patente];
    if(!m)return;
    if(window.confirm(`¿Restablecer datos oficiales de ${e.patente}?\nSobreescribirá horómetro, fechas e insumos con los datos del registro oficial.`)){
      upd({modelo:m.modelo,preventivaCada:m.preventivaCada,generalCada:m.generalCada,
        horaActual:m.horaActual,horaActualFecha:m.horaActualFecha,
        ultimaPreventivaHora:m.ultimaPreventivaHora,ultimaGeneralHora:m.ultimaGeneralHora,
        insumosPrev:[...m.insumosPrev],insumosGen:[...m.insumosGen]});
    }
  };

  return(
    <div style={{display:"grid",gridTemplateColumns:"minmax(0,3fr) minmax(0,1fr)",gap:20,alignItems:"start"}}>
      <div style={{display:"flex",flexDirection:"column",gap:18}}>

        {/* Identificación */}
        <div style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:16,padding:22,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
          <Sec>Identificación</Sec>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:14}}>
            <div><Lbl>Marca</Lbl>
              <Sel value={e.marca||""} onChange={v=>upd({marca:v.target.value,patente:"",modelo:""})}>
                <option value="">— Seleccionar —</option>
                {(BRANDS[e.categoria]||[]).map(m=><option key={m}>{m}</option>)}
              </Sel>
            </div>
            <div><Lbl>Patente / ID</Lbl>
              <Sel value={e.patente||""} onChange={v=>handlePatente(v.target.value)}>
                <option value="">— Seleccionar —</option>
                {platesFor(e.categoria,e.marca).map(p=><option key={p}>{p}</option>)}
              </Sel>
            </div>
            <div><Lbl>Operador</Lbl>
              <Sel value={e.operador||""} onChange={v=>upd({operador:v.target.value})}>
                <option value="">— Sin asignar —</option>
                {OPERATORS.map(o=><option key={o}>{o}</option>)}
              </Sel>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
            {e.modelo&&(
              <div style={{background:"#f8fafc",borderRadius:10,padding:"6px 12px"}}>
                <span style={{fontSize:12,color:P.txtMuted,fontWeight:600}}>Modelo: </span>
                <span style={{fontSize:12,color:P.txtTitle,fontWeight:700}}>{e.modelo}</span>
              </div>
            )}
            {MAESTRO[e.patente]&&(
              <button onClick={restablecer}
                style={{background:"#f59e0b",color:"#fff",border:"none",borderRadius:9,padding:"7px 14px",fontWeight:700,fontSize:11,textTransform:"uppercase",cursor:"pointer"}}>
                ↺ Restablecer datos oficiales
              </button>
            )}
          </div>
        </div>

        {/* Lectura Actual */}
        {!esBOC&&(
          <div style={{background:"#1d4ed8",borderRadius:16,padding:22,boxShadow:"0 4px 20px rgba(29,78,216,0.35)"}}>
            <p style={{fontSize:12,fontWeight:700,color:"#fff",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
              <span>📍</span> Lectura Actual
            </p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div><Lbl c="#fff">{lbl} ({unit})</Lbl>
                <input type="number" style={{width:"100%",padding:"13px 16px",borderRadius:12,background:"#fff",color:"#1e3a8a",fontWeight:900,fontSize:26,border:"none",outline:"none",boxSizing:"border-box"}}
                  value={e.horaActual||""} onChange={v=>upd({horaActual:Number(v.target.value)})} placeholder="0"/>
              </div>
              <div><Lbl c="#fff">Fecha de Lectura</Lbl>
                <input type="date" style={{width:"100%",padding:"13px 16px",borderRadius:12,background:"#fff",color:"#1e3a8a",fontWeight:600,fontSize:15,border:"none",outline:"none",boxSizing:"border-box"}}
                  value={e.horaActualFecha||""} onChange={v=>upd({horaActualFecha:v.target.value})}/>
              </div>
            </div>
          </div>
        )}

        {/* Odómetro Camiones */}
        {esCamion&&(
          <div style={{background:"#1e293b",borderRadius:16,padding:22}}>
            <p style={{fontSize:12,fontWeight:700,color:"#fff",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
              <span>🛣️</span> Odómetro Complementario (km)
            </p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div><Lbl c="#fff">Km Actual</Lbl>
                <input type="number" style={{width:"100%",padding:"12px 14px",borderRadius:10,background:"#334155",color:"#fff",fontWeight:900,fontSize:22,border:"none",outline:"none",boxSizing:"border-box"}}
                  placeholder="0" value={e.odometro||""} onChange={v=>upd({odometro:Number(v.target.value)})}/>
              </div>
              <div><Lbl c="#fff">Fecha</Lbl>
                <input type="date" style={{width:"100%",padding:"12px 14px",borderRadius:10,background:"#334155",color:"#fff",fontWeight:500,fontSize:14,border:"none",outline:"none",boxSizing:"border-box"}}
                  value={e.odometroFecha||""} onChange={v=>upd({odometroFecha:v.target.value})}/>
              </div>
            </div>
          </div>
        )}

        {/* Plan + Intervenciones */}
        {!esBOC&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:14,padding:18}}>
              <Sec>Plan de Mantenimiento</Sec>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {!esCam&&<div><Lbl>Preventiva cada ({unit})</Lbl>
                  <Inp type="number" value={e.preventivaCada||""} placeholder="ej: 250" onChange={v=>upd({preventivaCada:Number(v.target.value)})}/></div>}
                <div><Lbl>General cada ({unit})</Lbl>
                  <Inp type="number" value={e.generalCada||""} placeholder="ej: 2000" onChange={v=>upd({generalCada:Number(v.target.value)})}/></div>
                <div><Lbl>{unit} Proyectadas / Día</Lbl>
                  <Inp type="number" value={e.horasDiariasOverride||""} placeholder="ej: 8" onChange={v=>upd({horasDiariasOverride:Number(v.target.value)})}/></div>
              </div>
            </div>
            <div style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:14,padding:18}}>
              <Sec>Últimas Intervenciones</Sec>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {!esCam&&<div><Lbl>Últ. Preventiva ({unit})</Lbl>
                  <Inp type="number" value={e.ultimaPreventivaHora||""} placeholder="0" onChange={v=>upd({ultimaPreventivaHora:Number(v.target.value)})}/></div>}
                <div><Lbl>Últ. General ({unit})</Lbl>
                  <Inp type="number" value={e.ultimaGeneralHora||""} placeholder="0" onChange={v=>upd({ultimaGeneralHora:Number(v.target.value)})}/></div>
              </div>
            </div>
          </div>
        )}

        {/* Insumos */}
        {!esBOC&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {!esCam&&<InsumosTable title="Insumos Preventiva" value={e.insumosPrev||[]} onChange={v=>upd({insumosPrev:v})}/>}
            <InsumosTable title="Insumos General" value={e.insumosGen||[]} onChange={v=>upd({insumosGen:v})}/>
          </div>
        )}

        {/* Notas */}
        <div style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:14,padding:18}}>
          <Lbl>Notas y Observaciones</Lbl>
          <textarea style={{width:"100%",padding:"10px 13px",borderRadius:10,border:`2px solid ${P.border}`,background:P.card,color:P.txtTitle,fontSize:14,resize:"none",outline:"none",boxSizing:"border-box"}}
            rows={3} placeholder="Observaciones, próximos trabajos, recordatorios..."
            value={e.notas||""} onChange={v=>upd({notas:v.target.value})}/>
        </div>

        {/* Historial */}
        <HistorialPanel patente={e.patente}/>
      </div>

      {/* Panel lateral */}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <StatusPanel s={s} e={e} unit={unit} esCamioneta={esCam} upd={upd}/>
        <Btn v="danger" sx={{width:"100%",padding:"12px"}} onClick={()=>removeEquipo(e.id)}>
          🗑 Dar de Baja
        </Btn>
      </div>
    </div>
  );
});

/* ═══════════════════════ RESUMEN ═══════════════════════ */
function Resumen({equipos,calcularEstado}){
  const st=useMemo(()=>{
    let v=0,u=0,ok=0;
    equipos.forEach(e=>{const s=calcularEstado(e).salud;if(s==="VENCIDA")v++;else if(s==="URGENTE")u++;else ok++;});
    return{total:equipos.length,v,u,ok};
  },[equipos,calcularEstado]);
  if(!st.total)return null;
  return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
      {[
        {l:"Total",    n:st.total, bg:"#f1f5f9", fg:P.txtTitle},
        {l:"Vencidas", n:st.v,     bg:st.v>0?P.red:"#f1f5f9",    fg:st.v>0?"#fff":P.txtMuted},
        {l:"Urgentes", n:st.u,     bg:st.u>0?P.orange:"#f1f5f9", fg:st.u>0?"#fff":P.txtMuted},
        {l:"Al día",   n:st.ok,    bg:P.green, fg:"#fff"},
      ].map(s=>(
        <div key={s.l} style={{background:s.bg,borderRadius:14,padding:"14px 10px",textAlign:"center"}}>
          <div style={{fontSize:30,fontWeight:900,color:s.fg,lineHeight:1}}>{s.n}</div>
          <div style={{fontSize:11,fontWeight:700,color:s.fg,textTransform:"uppercase",letterSpacing:"0.05em",marginTop:3,opacity:0.85}}>{s.l}</div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════ APP ═══════════════════════ */
export default function App(){
  const[equipos,setEquipos]=useState([]);
  const[loading,setLoading]=useState(true);
  const[view,setView]=useState({cat:null,id:null});

  useEffect(()=>{
    let unsub=null;
    ensureAnonAuth().then(()=>{
      unsub=onSnapshot(collection(db,"equipos"),snap=>{
        setEquipos(snap.docs.map(d=>({id:d.id,...d.data()})));
        setLoading(false);
      });
    }).catch(e=>{console.error(e);setLoading(false);});
    return()=>unsub&&unsub();
  },[]);

  const calcularEstado=useCallback((e)=>{
    const esCam=e.categoria==="CAMIONETA";
    if(["BATEA","CAMA_BAJA"].includes(e.categoria))
      return{salud:"OK",estPrev:"OK",estGen:"OK",horaActual:0};
    const m=MAESTRO[e.patente];
    const prevCada=Number(e.preventivaCada||(m?.preventivaCada)||250);
    const genCada =Number(e.generalCada  ||(m?.generalCada) ||2000);
    const prontoLim=esCam?1000:120, urgenteLim=esCam?500:40;
    const elapsed=e.horaActualFecha
      ?(Number(e.horasDiariasOverride)>0
        ?daysBetween(e.horaActualFecha,todayISO())*Number(e.horasDiariasOverride)
        :workHrs(e.horaActualFecha,todayISO()))
      :0;
    const ha=Number(e.horaActual||0)+Math.max(0,elapsed);
    const ultPrev = Number(e.ultimaPreventivaHora||0);
    const ultGen  = Number(e.ultimaGeneralHora||0);
    let ep="OK",eg="OK";
    if(!esCam){
      if(!e.horaActual||Number(e.horaActual)===0)ep="⚠️ LECTURA";
      else if(!ultPrev||ultPrev===0)ep="⚙️ PREV";
      else{const r=(ultPrev+prevCada)-ha;if(r<=0)ep="VENCIDA";else if(r<=urgenteLim)ep="URGENTE";else if(r<=prontoLim)ep="PRONTO";}
    }
    if(!e.horaActual||Number(e.horaActual)===0)eg="⚠️ LECTURA";
    else if(!ultGen||ultGen===0)eg="🛠️ GEN";
    else{const r=(ultGen+genCada)-ha;if(r<=0)eg="VENCIDA";else if(r<=urgenteLim)eg="URGENTE";else if(r<=prontoLim)eg="PRONTO";}
    const pr={VENCIDA:6,URGENTE:5,"⚠️ LECTURA":4,"⚙️ PREV":3,"🛠️ GEN":2,PRONTO:1,OK:0};
    const worst=esCam?eg:(pr[ep]>=pr[eg]?ep:eg);
    return{horaActual:ha,
      proxPrev:ultPrev+prevCada,
      proxGen: ultGen+genCada,
      restPrev:(ultPrev+prevCada)-ha,
      restGen: (ultGen+genCada)-ha,
      estPrev:ep,estGen:eg,salud:worst};
  },[]);

  const pageStyle={padding:24,maxWidth:1100,margin:"0 auto",minHeight:"100vh",background:P.page};

  if(loading)return(
    <div style={{minHeight:"100vh",background:P.page,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:12}}>🛠️</div>
        <p style={{color:P.txtBody,fontWeight:600}}>Conectando con Firebase...</p>
      </div>
    </div>
  );

  if(!view.cat)return(
    <div style={pageStyle}>
      <header style={{marginBottom:24,paddingBottom:18,borderBottom:`4px solid ${P.dark}`}}>
        <h1 style={{fontSize:50,fontWeight:900,color:P.txtTitle,textTransform:"uppercase",fontStyle:"italic",lineHeight:1,margin:0}}>VIA 5</h1>
        <p style={{color:P.blue,fontWeight:700,fontSize:12,textTransform:"uppercase",letterSpacing:"0.25em",marginTop:6}}>Gestión de Flota y Mantenciones</p>
      </header>
      <Resumen equipos={equipos} calcularEstado={calcularEstado}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:18}}>
        {CATEGORIES.map(c=>{
          const us=equipos.filter(e=>e.categoria===c.id);
          const sl=us.map(e=>calcularEstado(e).salud);
          const crit=sl.some(s=>["VENCIDA","URGENTE"].includes(s));
          const falt=sl.some(s=>s.includes("LECTURA")||s.includes("PREV")||s.includes("GEN"));
          return(
            <div key={c.id} onClick={()=>setView({cat:c.id,id:null})}
              style={{background:P.card,border:`2px solid ${P.border}`,borderRadius:16,padding:26,cursor:"pointer",transition:"all 0.15s",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}
              onMouseOver={e=>{e.currentTarget.style.boxShadow="0 6px 20px rgba(0,0,0,0.12)";e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseOut={e=>{e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)";e.currentTarget.style.transform="none";}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <span style={{fontSize:48}}>{c.icon}</span>
                {us.length>0&&<span style={{padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:700,
                  background:crit?P.red:falt?P.dark:"#e2e8f0",
                  color:crit||falt?"#fff":P.txtTitle}}>
                  {us.length} equipo{us.length!==1?"s":""}
                </span>}
              </div>
              <h3 style={{fontSize:18,fontWeight:900,color:P.txtTitle,textTransform:"uppercase",fontStyle:"italic",margin:0}}>{c.label}</h3>
              {us.length===0&&<p style={{fontSize:12,color:P.txtDim,marginTop:4}}>Sin equipos registrados</p>}
            </div>
          );
        })}
      </div>
    </div>
  );

  if(view.cat&&!view.id){
    const cat=CATEGORIES.find(c=>c.id===view.cat);
    const ecs=equipos.filter(e=>e.categoria===view.cat);
    const bc=s=>({VENCIDA:P.red,URGENTE:P.orange,PRONTO:P.yellow,OK:P.green}[s]||P.green);
    return(
      <div style={pageStyle}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
          <Btn v="secondary" sx={{borderRadius:"50%",width:42,height:42,padding:0,fontSize:18}} onClick={()=>setView({cat:null,id:null})}>←</Btn>
          <div>
            <h2 style={{fontSize:34,fontWeight:900,color:P.txtTitle,textTransform:"uppercase",fontStyle:"italic",lineHeight:1,margin:0}}>{cat.icon} {cat.label}</h2>
            <p style={{fontSize:12,color:P.txtMuted,fontWeight:600,marginTop:4}}>{ecs.length} equipo{ecs.length!==1?"s":""} registrado{ecs.length!==1?"s":""}</p>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:14}}>
          {ecs.map(e=>{
            const s=calcularEstado(e);
            return(
              <div key={e.id} onClick={()=>setView({...view,id:e.id})}
                style={{background:P.card,border:`1px solid ${P.border}`,borderLeft:`6px solid ${bc(s.salud)}`,borderRadius:14,padding:18,cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",transition:"all 0.15s"}}
                onMouseOver={e=>{e.currentTarget.style.boxShadow="0 4px 14px rgba(0,0,0,0.12)";}}
                onMouseOut={e=>{e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)";}}>
                <div style={{fontSize:20,fontWeight:900,color:P.txtTitle,textTransform:"uppercase",lineHeight:1,marginBottom:3}}>{e.patente||"S/P"}</div>
                <div style={{fontSize:11,fontWeight:600,color:P.txtDim,textTransform:"uppercase",marginBottom:4}}>{e.modelo||e.marca||"Sin modelo"}</div>
                {e.operador&&<div style={{fontSize:12,color:P.txtBody,marginBottom:8}}>👤 {e.operador}</div>}
                <div style={{marginBottom:6}}><Badge e={s.salud}/></div>
                {e.horaActual>0&&<div style={{fontSize:11,color:P.txtMuted}}>{e.categoria==="CAMIONETA"?`${fmt(e.horaActual)} km`:`${fmt(e.horaActual)} h`}</div>}
              </div>
            );
          })}
          <button
            onClick={()=>{
              const base={categoria:view.cat,marca:"",patente:"",modelo:"",operador:"",
                horaActual:0,horaActualFecha:todayISO(),
                ultimaPreventivaHora:0,ultimaGeneralHora:0,
                preventivaCada:0,generalCada:0,horasDiariasOverride:0,
                insumosPrev:[],insumosGen:[],notas:"",updatedAt:serverTimestamp()};
              addDoc(collection(db,"equipos"),base).then(d=>setView({...view,id:d.id}));
            }}
            style={{border:`2px dashed ${P.border}`,borderRadius:14,padding:18,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"transparent",cursor:"pointer",color:P.txtDim,fontWeight:700,fontSize:13,textTransform:"uppercase",gap:8,minHeight:100,transition:"all 0.15s"}}
            onMouseOver={e=>{e.currentTarget.style.borderColor=P.blue;e.currentTarget.style.color=P.blue;}}
            onMouseOut={e=>{e.currentTarget.style.borderColor=P.border;e.currentTarget.style.color=P.txtDim;}}>
            <span style={{fontSize:26}}>+</span><span>Nuevo equipo</span>
          </button>
        </div>
      </div>
    );
  }

  const eq=equipos.find(x=>x.id===view.id);
  return(
    <div style={{padding:24,maxWidth:1300,margin:"0 auto",minHeight:"100vh",background:P.page}}>
      <div style={{marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"center",background:P.card,padding:"14px 18px",borderRadius:14,boxShadow:"0 1px 4px rgba(0,0,0,0.07)",border:`1px solid ${P.border}`}}>
        <Btn v="secondary" onClick={()=>setView({...view,id:null})}>← Volver</Btn>
        <div style={{textAlign:"right"}}>
          <p style={{fontSize:11,fontWeight:700,color:P.blue,textTransform:"uppercase",letterSpacing:"0.15em",margin:0}}>Ficha Técnica</p>
          <h2 style={{fontSize:26,fontWeight:900,color:P.txtTitle,fontStyle:"italic",textTransform:"uppercase",margin:0,lineHeight:1}}>{eq?.patente||"Sin identificar"}</h2>
          {eq?.modelo&&<p style={{fontSize:12,color:P.txtMuted,margin:"2px 0 0"}}>{eq.modelo}</p>}
          {eq?.operador&&<p style={{fontSize:12,color:P.txtMuted,margin:"2px 0 0"}}>👤 {eq.operador}</p>}
        </div>
      </div>
      {eq?(
        <RowEditor e={eq} calcularEstado={calcularEstado}
          updateEquipo={(id,p)=>updateDoc(doc(db,"equipos",id),{...p,updatedAt:serverTimestamp()})}
          removeEquipo={(id)=>{if(window.confirm("¿Dar de baja este activo?")){{deleteDoc(doc(db,"equipos",id));setView({...view,id:null});}}}}/>
      ):(
        <div style={{textAlign:"center",padding:"70px 0",color:P.txtDim}}>
          <p style={{fontSize:46,marginBottom:12}}>🔍</p>
          <p style={{fontWeight:600}}>Equipo no encontrado</p>
          <Btn v="secondary" sx={{marginTop:14}} onClick={()=>setView({...view,id:null})}>Volver al listado</Btn>
        </div>
      )}
    </div>
  );
}
