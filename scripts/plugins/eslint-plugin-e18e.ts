import type { Rule } from "../../src/interfaces/rule.ts";
import type { CreateRule } from "../generator.ts";

export const fetchEslintPluginE18eRules = async (
	createRule: CreateRule,
): Promise<{ name: string; rules: Rule[] }> => {
	const rules: Rule[] = [];

	const response = await fetch(
		"https://raw.githubusercontent.com/e18e/eslint-plugin/refs/heads/main/README.md",
	);
	const markdown = await response.text();

	const lines = markdown.split("\n");
	lines
		.filter((e) => /^\| \[(.*)\]\(\.\/src\/rules\/(.*)\.ts\).*/.test(e))
		.forEach((e) => {
			const parts = /^\| \[(.*)\]\(([a-z0-9-_./:#]*)\)/.exec(e);

			if (!parts) return;

			const [_, name, path] = parts;

			rules.push(
				createRule(
					"eslintE18e",
					name,
					`https://github.com/e18e/eslint-plugin/tree/main/${path}`,
				),
			);
		});

	return {
		name: "@e18e/eslint-plugin",
		rules,
	};
};
