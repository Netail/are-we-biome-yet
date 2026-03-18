import type { Rule } from "../../src/interfaces/rule.ts";
import type { CreateRule } from "../generator.ts";
import { parse } from "../parser.ts";

const BASE_URL = "https://html-eslint.org/docs/rules";

export const fetchEslintPluginHtmlRules = async (
	createRule: CreateRule,
): Promise<{ name: string; rules: Rule[] }> => {
	const rules: Rule[] = [];

	const response = await fetch(BASE_URL);
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
					"htmlEslint",
					path.split("/").pop() || "",
					`${BASE_URL}${path}`,
				),
			);
		}
	}

	return {
		name: "@html-eslint/eslint-plugin",
		rules,
	};
};
