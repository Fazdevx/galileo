import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
//#region src/pages/api/save-data.ts
var save_data_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async () => {
	return new Response(JSON.stringify({
		success: false,
		error: "Use client-side Firebase"
	}), {
		status: 200,
		headers: { "Content-Type": "application/json" }
	});
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/save-data@_@ts
var page = () => save_data_exports;
//#endregion
export { page };
