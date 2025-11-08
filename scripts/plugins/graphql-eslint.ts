import { parse } from "node-html-parser";
import type { Rule } from "../../src/interfaces/rule.ts";
import type { CreateRule } from "../generator.ts";

const BASE_URL = `https://the-guild.dev`;

export const fetchGraphqlEslintRules = async (
	createRule: CreateRule,
): Promise<{ name: string, rules: Rule[] }> => {
	const rules: Rule[] = [];

	const response = await fetch(`${BASE_URL}/graphql/eslint/rules`);
	const htmlPage = await response.text();

	const html = parse(htmlPage);
	const table = html.querySelector("table");
	const rows = table?.querySelectorAll("a") || [];

	for (const row of rows) {
		const path = row.getAttribute("href");

		if (!path) continue;

		rules.push(
			createRule(
				"eslintGraphql",
				path.split("/").pop() || "",
				`${BASE_URL}${path}`,
			),
		);
	}

	return {
		name: "@graphql-eslint/eslint-plugin",
		rules,
	};
};
