import { parse } from "node-html-parser";
import type { Rule } from "../../src/interfaces/rule.ts";
import type { CreateRule } from "../generator.ts";

const BASE_URL = "https://react.dev";

export const fetchEslintPluginReactHooksRules = async (
	createRule: CreateRule,
): Promise<{ name: string; rules: Rule[] }> => {
	const rules: Rule[] = [];

	const response = await fetch(
		`${BASE_URL}/reference/eslint-plugin-react-hooks`,
	);
	const htmlPage = await response.text();

	const html = parse(htmlPage);
	const lists = html.querySelectorAll("main ul");

	for (const list of lists) {
		const listItems = list.querySelectorAll("a") || [];

		for (const listItem of listItems) {
			const path = listItem.getAttribute("href");

			if (!path) continue;

			rules.push(
				createRule(
					"eslintReactHooks",
					path.split("/").pop() || "",
					`${BASE_URL}${path}`,
				),
			);
		}
	}

	return {
		name: "eslint-plugin-react-hooks",
		rules,
	};
};
