import type { Rule } from "../../src/interfaces/rule.ts";
import type { CreateRule } from "../generator.ts";
import { parse } from "../parser.ts";

const BASE_URL = "https://ota-meshi.github.io/eslint-plugin-yml";

export const fetchEslintPluginYmlRules = async (
	createRule: CreateRule,
): Promise<{ name: string; rules: Rule[] }> => {
	const rules: Rule[] = [];

const response = await fetch(`${BASE_URL}/rules`);
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
					"eslintYml",
					path.split("/").pop()?.replace(".html", "") || "",
					`${BASE_URL}/rules/${path}`,
				),
			);
		}
	}

	return {
		name: "eslint-plugin-yml",
		rules,
	};
};
