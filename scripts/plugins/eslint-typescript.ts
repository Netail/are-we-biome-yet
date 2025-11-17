import { parse } from "node-html-parser";
import type { Rule } from "../../src/interfaces/rule.ts";
import type { CreateRule } from "../generator.ts";

const BASE_URL = "https://typescript-eslint.io";

export const fetchEslintTypeScriptRules = async (
	createRule: CreateRule,
): Promise<{ name: string; rules: Rule[] }> => {
	const rules: Rule[] = [];

	const response = await fetch(`${BASE_URL}/rules/`);
	const htmlPage = await response.text();

	const html = parse(htmlPage);
	const table = html.querySelector("table");
	const rows = table?.querySelectorAll("tr") || [];

	for (const row of rows) {
		if (row.toString().includes("💀")) continue;

		const path = row.querySelector("a")?.getAttribute("href");

		if (!path) continue;

		rules.push(
			createRule(
				"eslintTypeScript",
				path.split("/").pop() || "",
				`${BASE_URL}${path}`,
			),
		);
	}

	return { name: "typescript-eslint", rules };
};
