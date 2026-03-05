import type { Rule } from "../../src/interfaces/rule.ts";
import type { CreateRule } from "../generator.ts";
import { parse } from "../parser.ts";

const BASE_URL = "https://stylelint.io";

export const fetchStylelintRules = async (
	createRule: CreateRule,
): Promise<{ name: string; rules: Rule[] }> => {
	const rules: Rule[] = [];

	const response = await fetch(`${BASE_URL}/user-guide/rules/`);
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
					"stylelint",
					path.split("/").pop() || "",
					`${BASE_URL}${path}`,
				),
			);
		}
	}

	return {
		name: "stylelint",
		rules,
	};
};
