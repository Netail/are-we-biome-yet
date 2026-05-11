import type { Rule } from "../../src/interfaces/rule.ts";
import type { CreateRule } from "../generator.ts";
import { parse } from "../parser.ts";

const BASE_URL = "https://www.eslint-react.xyz/";

export const fetchEslintPluginReactXyzRules = async (
	createRule: CreateRule,
): Promise<{ name: string; rules: Rule[] }> => {
	const rules: Rule[] = [];

	const response = await fetch(`${BASE_URL}/docs/rules`);
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
					"eslintReactXyz",
					path.split("/").pop() || "",
					`${BASE_URL}${path}`,
				),
			);
		}
	}

	return {
		name: "@eslint-react/eslint-plugin",
		rules,
	};
};
