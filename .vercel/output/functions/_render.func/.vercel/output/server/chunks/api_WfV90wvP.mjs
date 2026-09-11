import { getApp, getApps, initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
var DEFAULT_DATA = {
	sections: [],
	sports: [],
	games: [],
	heroStats: {
		secciones: 0,
		disciplinas: 0,
		dias: 0
	},
	prizes: [...[
		{
			id: "p1",
			name: "5% Descuento",
			description: "5% de descuento en tu próxima mensualidad",
			type: "descuento_mensualidad",
			value: 5,
			color: "bg-emerald-500",
			icon: "money"
		},
		{
			id: "p2",
			name: "10% Descuento",
			description: "10% de descuento en tu próxima mensualidad",
			type: "descuento_mensualidad",
			value: 10,
			color: "bg-brand-500",
			icon: "gift"
		},
		{
			id: "p3",
			name: "15% Descuento",
			description: "15% de descuento en tu próxima mensualidad",
			type: "descuento_mensualidad",
			value: 15,
			color: "bg-purple-500",
			icon: "star"
		},
		{
			id: "p4",
			name: "20% Matrícula",
			description: "20% de descuento en matrícula de tu hijo",
			type: "descuento_matricula",
			value: 20,
			color: "bg-rose-500",
			icon: "graduation"
		},
		{
			id: "p5",
			name: "1 Libro",
			description: "1 libro de regalo para tu hijo",
			type: "libro",
			value: 1,
			color: "bg-sky-500",
			icon: "book"
		},
		{
			id: "p6",
			name: "2 Cuadernos",
			description: "2 cuadernos de regalo",
			type: "cuaderno",
			value: 2,
			color: "bg-amber-500",
			icon: "notebook"
		},
		{
			id: "p7",
			name: "5% Descuento",
			description: "5% de descuento en tu próxima mensualidad",
			type: "descuento_mensualidad",
			value: 5,
			color: "bg-emerald-500",
			icon: "money"
		},
		{
			id: "p8",
			name: "10% Descuento",
			description: "10% de descuento en tu próxima mensualidad",
			type: "descuento_mensualidad",
			value: 10,
			color: "bg-brand-500",
			icon: "gift"
		},
		{
			id: "p9",
			name: "15% Descuento",
			description: "15% de descuento en tu próxima mensualidad",
			type: "descuento_mensualidad",
			value: 15,
			color: "bg-purple-500",
			icon: "star"
		},
		{
			id: "p10",
			name: "20% Matrícula",
			description: "20% de descuento en matrícula de tu hijo",
			type: "descuento_matricula",
			value: 20,
			color: "bg-rose-500",
			icon: "graduation"
		},
		{
			id: "p11",
			name: "1 Libro",
			description: "1 libro de regalo para tu hijo",
			type: "libro",
			value: 1,
			color: "bg-sky-500",
			icon: "book"
		},
		{
			id: "p12",
			name: "2 Cuadernos",
			description: "2 cuadernos de regalo",
			type: "cuaderno",
			value: 2,
			color: "bg-amber-500",
			icon: "notebook"
		},
		{
			id: "p13",
			name: "5% Descuento",
			description: "5% de descuento en tu próxima mensualidad",
			type: "descuento_mensualidad",
			value: 5,
			color: "bg-emerald-500",
			icon: "money"
		},
		{
			id: "p14",
			name: "10% Descuento",
			description: "10% de descuento en tu próxima mensualidad",
			type: "descuento_mensualidad",
			value: 10,
			color: "bg-brand-500",
			icon: "gift"
		},
		{
			id: "p15",
			name: "15% Descuento",
			description: "15% de descuento en tu próxima mensualidad",
			type: "descuento_mensualidad",
			value: 15,
			color: "bg-purple-500",
			icon: "star"
		},
		{
			id: "p16",
			name: "20% Matrícula",
			description: "20% de descuento en matrícula de tu hijo",
			type: "descuento_matricula",
			value: 20,
			color: "bg-rose-500",
			icon: "graduation"
		}
	]]
};
//#endregion
//#region src/lib/firebase.ts
var firebaseConfig = {
	apiKey: "AIzaSyAgjrkE_Ah-mKOm8naH-aFEB7UrschO40o",
	authDomain: "galiweb-4cc7d.firebaseapp.com",
	projectId: "galiweb-4cc7d",
	storageBucket: "galiweb-4cc7d.firebasestorage.app",
	messagingSenderId: "192323726068",
	appId: "1:192323726068:web:9cebbbd6d9e20c12ce0ca1",
	measurementId: "G-V9WEJ4RYTG"
};
var app = null;
var dbInstance = null;
var firebaseError = null;
try {
	app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
	dbInstance = getFirestore(app);
	getAuth(app);
} catch (error) {
	console.error("[Firebase] Initialization error:", error);
	firebaseError = error instanceof Error ? error : new Error(String(error));
}
var db = dbInstance;
var FIREBASE_CONFIGURED = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && !firebaseError);
//#endregion
//#region src/data/api.ts
var OIMPIADAS_DOC_ID = "olimpiadas-data";
var API_CONFIGURED = FIREBASE_CONFIGURED;
var isQuotaExhausted = false;
async function fetchData() {
	if (!API_CONFIGURED || !db || isQuotaExhausted) return DEFAULT_DATA;
	try {
		const docRef = doc(db, "olimpiadas", OIMPIADAS_DOC_ID);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			const data = docSnap.data();
			console.log("[Firebase] Datos obtenidos de Firebase:", data);
			if (data.sections && data.sports && data.games && data.heroStats) return data;
		}
		console.log("[Firebase] Firebase vacío o inválido, inicializando con datos predeterminados");
		console.log("[Firebase] Creando estructura: colección \"olimpiadas\", documento \"olimpiadas-data\"");
		await setDoc(docRef, DEFAULT_DATA);
		console.log("[Firebase] Datos predeterminados guardados en Firebase:", DEFAULT_DATA);
		return DEFAULT_DATA;
	} catch (error) {
		console.warn("[Firebase] Error al obtener datos:", error);
		console.log("[Firebase] Usando datos predeterminados como fallback");
		return DEFAULT_DATA;
	}
}
async function saveData(data) {
	if (!API_CONFIGURED || !db || isQuotaExhausted) return false;
	try {
		const docRef = doc(db, "olimpiadas", OIMPIADAS_DOC_ID);
		console.log("[Firebase] Guardando datos en estructura correcta: colección \"olimpiadas\", documento \"olimpiadas-data\"");
		await setDoc(docRef, data);
		console.log("[Firebase] Datos guardados exitosamente en Firebase:", data);
		return true;
	} catch (error) {
		console.warn("[Firebase] Error al guardar datos:", error);
		return false;
	}
}
//#endregion
export { saveData as n, DEFAULT_DATA as r, fetchData as t };
