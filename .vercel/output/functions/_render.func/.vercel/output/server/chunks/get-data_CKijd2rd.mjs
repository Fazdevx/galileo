import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as fetchData } from "./api_BAaDowp8.mjs";
//#region src/pages/api/get-data.ts
var get_data_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async () => {
	try {
		const data = await fetchData();
		return new Response(JSON.stringify(data), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("[API] Error fetching data:", error);
		return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/get-data@_@ts
var page = () => get_data_exports;
//#endregion
export { page };
