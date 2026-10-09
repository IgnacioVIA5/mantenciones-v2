// Aplica a Firestore el plan generado por leer_petroleo.py (lecturas_pendientes.json).
// Solo sube los items con accion === "actualizar"; los "revisar" se listan pero no se tocan.
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const firebaseConfig = {
  apiKey: "AIzaSyAwBnvWXLKO7ctOwmHYf4SO2CACz1D6ADI",
  authDomain: "mantenciones-v-5.firebaseapp.com",
  projectId: "mantenciones-v-5",
  storageBucket: "mantenciones-v-5.firebasestorage.app",
  messagingSenderId: "294743117767",
  appId: "1:294743117767:web:27f28d9e2276484308d3e2",
};

const planPath = path.join(__dirname, "lecturas_pendientes.json");
const { plan } = JSON.parse(fs.readFileSync(planPath, "utf8"));

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
await signInAnonymously(auth);

const snap = await getDocs(collection(db, "equipos"));
const idPorPatente = {};
snap.forEach(d => { if (d.data().patente) idPorPatente[d.data().patente] = d.id; });

const aplicar = plan.filter(i => i.accion === "actualizar");
const revisar = plan.filter(i => i.accion === "revisar");

console.log(`== Aplicando ${aplicar.length} actualizaciones ==`);
for (const item of aplicar) {
  const id = idPorPatente[item.patente];
  if (!id) { console.log(`  ! ${item.patente}: no encontrado en Firestore, se omite`); continue; }
  await updateDoc(doc(db, "equipos", id), {
    [item.campoFirestore]: item.valorNuevo,
    [item.campoFechaFirestore]: item.fechaNueva,
  });
  console.log(`  OK ${item.patente} ${item.campo}: ${item.valorActual} -> ${item.valorNuevo} (${item.fechaNueva})`);
}

if (revisar.length) {
  console.log(`\n== ${revisar.length} item(s) requieren revision manual (no se tocaron) ==`);
  for (const item of revisar) {
    console.log(`  ⚠️  ${item.patente} ${item.campo}: ${item.motivo}`);
  }
}

process.exit(0);
