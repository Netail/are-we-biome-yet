import type { Rule } from "../../src/interfaces/rule.ts";
import type { CreateRule } from "../generator.ts";

export const fetchEslintPluginGraphqlRules = async (
	createRule: CreateRule,
): Promise<{ name: string; rules: Rule[] }> => {
	const rules: Rule[] = [];

	const response = await fetch(
		"https://raw.githubusercontent.com/graphql-hive/graphql-eslint/refs/heads/master/website/content/rules/index.md",
	);
	const markdown = await response.text();

	const lines = markdown.split("\n");
	lines
		.filter((e) => /^\[(.*)\]\(\/rules\/(.*)\).*/.test(e))
		.filter((e) => !e.includes("❌"))
		.forEach((e) => {
			const parts = /^\[(.*)\]\(([a-z0-9-_./:#]*)\)/.exec(e);

			if (!parts) return;

			const [_, name, path] = parts;

			rules.push(
				createRule(
					"eslintGraphql",
					name,
					`https://the-guild.dev/graphql/eslint${path}`,
				),
			);
		});

	return {
		name: "@graphql-eslint/eslint-plugin",
		rules,
	};
};
