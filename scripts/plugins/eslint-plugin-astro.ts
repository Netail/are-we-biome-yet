import type { Rule } from "../../src/interfaces/rule.ts";
import type { CreateRule } from "../generator.ts";

export const fetchEslintPluginAstroRules = async (
	createRule: CreateRule,
): Promise<{ name: string; rules: Rule[] }> => {
	const rules: Rule[] = [];

	const response = await fetch(
		`https://raw.githubusercontent.com/ota-meshi/eslint-plugin-astro/refs/heads/main/README.md`,
	);
	const markdown = await response.text();

	const preDeprecated = markdown.split("## Deprecated")[0];
	const lines = preDeprecated.split("\n");
	lines
		.filter((e) => /^\| \[astro\/(.*)\]\((.*)\).*/.test(e))
		.filter((e) => !e.includes('jsx-a11y'))
		.forEach((e) => {
			const parts = /^\| \[astro\/(.*)\]\((.*)\)/.exec(e);

			if (!parts) return;

			const [_, name] = parts;

			rules.push(
				createRule(
					"eslintAstro",
					name,
					`https://ota-meshi.github.io/eslint-plugin-astro/rules/${name}`,
				),
			);
		});

	return {
		name: "eslint-plugin-astro",
		rules,
	};
};
