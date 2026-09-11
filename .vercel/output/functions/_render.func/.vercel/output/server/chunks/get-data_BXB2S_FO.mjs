import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { r as DEFAULT_DATA, t as fetchData } from "./api_WfV90wvP.mjs";
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
		return new Response(JSON.stringify(DEFAULT_DATA), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/get-data@_@ts
var page = () => get_data_exports;
//#endregion
export { page };
