import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as DEFAULT_DATA } from "./olimpiadasStore_D_gh0MJe.mjs";
//#region src/pages/api/get-data.ts
var get_data_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async () => {
	return new Response(JSON.stringify(DEFAULT_DATA), {
		status: 200,
		headers: { "Content-Type": "application/json" }
	});
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/get-data@_@ts
var page = () => get_data_exports;
//#endregion
export { page };
