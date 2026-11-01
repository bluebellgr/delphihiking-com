import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

/**
 * Contact form handler. Sends the inquiry by email through Resend (https://resend.com).
 * Secrets / vars (set with `wrangler secret put` or in the Cloudflare dashboard):
 *   RESEND_API_KEY  required
 *   INQUIRY_TO      optional, defaults to info@delphihiking.com
 *   INQUIRY_FROM    optional, must be on a domain verified in Resend
 */
export const POST: APIRoute = async ({ request, redirect }) => {
	const form = await request.formData();
	const get = (k: string) => String(form.get(k) ?? "").trim().slice(0, 4000);

	// Honeypot: bots fill hidden fields. Pretend success.
	if (get("company")) return redirect("/contact?sent=1#form", 303);

	const name = get("name");
	const email = get("email");
	if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return redirect("/contact?error=1#form", 303);

	const vars = env as unknown as Record<string, string | undefined>;
	const tour = get("tour") || "Not sure yet";
	const text = [
		`Name: ${name}`,
		`Email: ${email}`,
		`Hike: ${tour}`,
		`Preferred date: ${get("date") || "-"}`,
		`Group size: ${get("size") || "-"}`,
		"",
		get("message") || "(no message)",
	].join("\n");

	if (!vars.RESEND_API_KEY) {
		console.error("RESEND_API_KEY is not set; inquiry not sent", text);
		return redirect("/contact?error=1#form", 303);
	}

	const res = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: { Authorization: `Bearer ${vars.RESEND_API_KEY}`, "Content-Type": "application/json" },
		body: JSON.stringify({
			from: vars.INQUIRY_FROM ?? "Delphi Hiking <bookings@delphihiking.com>",
			to: [vars.INQUIRY_TO ?? "info@delphihiking.com"],
			reply_to: email,
			subject: `Hike inquiry: ${tour} (${name})`,
			text,
		}),
	});
	if (!res.ok) console.error("Resend error", res.status, await res.text());
	return redirect(res.ok ? "/contact?sent=1#form" : "/contact?error=1#form", 303);
};
