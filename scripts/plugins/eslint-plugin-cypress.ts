import type { Rule } from "../../src/interfaces/rule.ts";
import type { CreateRule } from "../generator.ts";

export const fetchEslintPluginCypressRules = async (
	createRule: CreateRule,
): Promise<{ name: string; rules: Rule[] }> => {
	const rules: Rule[] = [];

	const response = await fetch(
		"https://raw.githubusercontent.com/cypress-io/eslint-plugin-cypress/refs/heads/master/README.md",
	);
	const markdown = await response.text();

	const lines = markdown.split("\n");
	lines
		.filter((e) => /^\| \[(.*)\]\(docs\/rules\/(.*)\.md\).*/.test(e))
		.filter((e) => !e.includes("❌"))
		.forEach((e) => {
			const parts = /^\| \[(.*)\]\(([a-z0-9-_./:#]*)\)/.exec(e);

			if (!parts) return;

			const [_, name, path] = parts;

			rules.push(
				createRule(
					"eslintCypress",
					name,
					`https://github.com/cypress-io/eslint-plugin-cypress/blob/master/${path}`,
				),
			);
		});

	return {
		name: "eslint-plugin-cypress",
		rules,
	};
};
