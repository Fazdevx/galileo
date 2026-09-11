import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
//#region src/pages/api/test.ts
var test_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async () => {
	return new Response(JSON.stringify({
		status: "ok",
		message: "API is working",
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		env: {
			hasApiKey: true,
			hasProjectId: true
		}
	}), {
		status: 200,
		headers: { "Content-Type": "application/json" }
	});
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/test@_@ts
var page = () => test_exports;
//#endregion
export { page };
