import type { Rule } from "../../src/interfaces/rule.ts";
import type { CreateRule } from "../generator.ts";
import { parse } from "../parser.ts";

const BASE_URL = "https://sveltejs.github.io";

export const fetchEslintPluginSvelteRules = async (
	createRule: CreateRule,
): Promise<{ name: string; rules: Rule[] }> => {
	const rules: Rule[] = [];

	const response = await fetch(`${BASE_URL}/eslint-plugin-svelte/rules/`);
	const htmlPage = await response.text();

	const html = parse(htmlPage);
	const tables = html.querySelectorAll("table") || [];

	for (const table of tables) {
		const rows = table.querySelectorAll("tr") || [];

		for (const row of rows) {
			const path = row.querySelector("a")?.getAttribute("href");

			if (!path) continue;

			rules.push(
				createRule(
					"eslintSvelte",
					path.slice(0, -1).split("/").pop() || "",
					`${BASE_URL}${path}`,
				),
			);
		}
	}

	return {
		name: "eslint-plugin-svelte",
		rules,
	};
};
