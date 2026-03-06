import type { Rule } from "../../src/interfaces/rule.ts";
import type { CreateRule } from "../generator.ts";

export const fetchEslintPluginPlaywrightRules = async (
	createRule: CreateRule,
): Promise<{ name: string; rules: Rule[] }> => {
	const rules: Rule[] = [];

	const response = await fetch(
		"https://raw.githubusercontent.com/mskelton/eslint-plugin-playwright/refs/heads/main/README.md",
	);
	const markdown = await response.text();

	const lines = markdown.split("\n");
	lines
		.filter((e) => /^\| \[(.*)\]\((.*)\/docs\/rules\/(.*)\.md\).*/.test(e))
		.forEach((e) => {
			const parts = /^\| \[(.*)\]\(([a-z0-9-_./:#]*)\)/.exec(e);

			if (!parts) return;

			const [_, name, path] = parts;

			rules.push(
				createRule(
					"eslintPlaywright",
					name,
					path,
				),
			);
		});

	return {
		name: "eslint-plugin-playwright",
		rules,
	};
};
