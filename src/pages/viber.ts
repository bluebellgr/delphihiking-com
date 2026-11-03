import type { APIRoute } from "astro";

const NUMBER = "+306912345678"; // your Viber number, international format

export const GET: APIRoute = () =>
	new Response(null, {
		status: 302,
		headers: { Location: `viber://chat?number=${encodeURIComponent(NUMBER)}` },
	});