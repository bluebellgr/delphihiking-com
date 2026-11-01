/** Difficulty label -> Organic tag class */
export function difficultyTag(d?: string | null) {
	const v = (d ?? "").toUpperCase();
	if (v === "EASY") return "tag tag-accent-2";
	if (v === "HARD") return "tag tag-neutral";
	return "tag tag-accent";
}

export const euro = (n?: number | null) => (n == null ? "" : "€" + n.toLocaleString("en-US"));

/** Short hiking time for cards: "3 h 30 min incl. stops" -> "3 h 30 min" */
export const shortTime = (s?: string | null) => (s ?? "").replace(/\s*incl\..*$/i, "");
