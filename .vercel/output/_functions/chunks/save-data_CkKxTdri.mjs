import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { n as saveData } from "./api_WfV90wvP.mjs";
//#region src/pages/api/save-data.ts
var save_data_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var POST = async ({ request }) => {
	try {
		console.log("[API] Received save request");
		console.log("[API] Request headers:", Object.fromEntries(request.headers.entries()));
		let data;
		const contentType = request.headers.get("content-type");
		console.log("[API] Content-Type:", contentType);
		if (contentType && contentType.includes("multipart/form-data")) {
			const dataString = (await request.formData()).get("data");
			console.log("[API] FormData data string length:", dataString?.length);
			console.log("[API] FormData data preview:", dataString?.substring(0, 200));
			if (!dataString) {
				console.error("[API] Empty FormData data");
				return new Response(JSON.stringify({
					success: false,
					error: "Empty FormData data"
				}), {
					status: 400,
					headers: { "Content-Type": "application/json" }
				});
			}
			data = JSON.parse(dataString);
		} else {
			const text = await request.text();
			console.log("[API] JSON body length:", text.length);
			console.log("[API] JSON body preview:", text.substring(0, 200));
			if (!text || text.trim() === "") {
				console.error("[API] Empty JSON body");
				return new Response(JSON.stringify({
					success: false,
					error: "Empty JSON body"
				}), {
					status: 400,
					headers: { "Content-Type": "application/json" }
				});
			}
			data = JSON.parse(text);
		}
		console.log("[API] Parsed data:", data);
		const success = await saveData(data);
		console.log("[API] Save result:", success);
		if (success) return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
		else return new Response(JSON.stringify({
			success: false,
			error: "Failed to save data"
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("[API] Error saving data:", error);
		return new Response(JSON.stringify({
			success: false,
			error: "Invalid request",
			details: String(error)
		}), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/save-data@_@ts
var page = () => save_data_exports;
//#endregion
export { page };
