import type { Rule } from "@/interfaces/rule";

export const calculate = (rules: Rule[]) => {
	const total = rules.length;
	const available = rules.filter((e) => e.state !== "missing").length;
	const percentage = Math.round(Math.max((available / total) * 100));

	return {
		total,
		available,
		percentage,
	};
};
