import { parse } from "node-html-parser";
import type { Rule } from "../../src/interfaces/rule.ts";
import type { CreateRule } from "../generator.ts";

const BASE_URL = "https://eslint.vuejs.org";

export const fetchEslintPluginVueRules = async (
	createRule: CreateRule,
): Promise<{ name: string; rules: Rule[] }> => {
	const rules: Rule[] = [];

	const response = await fetch(`${BASE_URL}/rules`);
	const htmlPage = await response.text();

	const html = parse(htmlPage);
	const tables = html.querySelectorAll("table");

	for (const table of tables) {
		if (table.toString().includes("Replaced by")) continue;

		const rows = table?.querySelectorAll("tr") || [];

		for (const row of rows) {
			const path = row.querySelector("a")?.getAttribute("href");

			if (!path) continue;

			rules.push(
				createRule(
					"eslintVueJs",
					path.split("/").pop() || "",
					`${BASE_URL}${path}`,
				),
			);
		}
	}

	return {
		name: "eslint-plugin-vue",
		rules,
	};
};
