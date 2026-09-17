import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

await signInAnonymously(auth);

const snap = await getDocs(collection(db, "equipos"));
const equipos = [];
snap.forEach(d => equipos.push({ id: d.id, ...d.data() }));

fs.writeFileSync(
  path.join(__dirname, "equipos.json"),
  JSON.stringify(equipos, null, 2)
);
console.log(`Descargados ${equipos.length} equipos.`);
process.exit(0);
