import type { Rule } from "../../src/interfaces/rule.ts";
import type { CreateRule } from "../generator.ts";

const BASE_URL = "https://eslint-react.xyz";

export const fetchEslintPluginReactXyzRules = async (
	createRule: CreateRule,
): Promise<{ name: string; rules: Rule[] }> => {
	const rules: Rule[] = [];

	const response = await fetch(`${BASE_URL}/llms.mdx/docs/rules/content`);
	const markdown = await response.text();

	const lines = markdown.split("\n");
	const found = new Set();
	lines
		.filter((e) => /^\| \[`(.*)`\]\(\/docs\/rules\/(.*)\).*/.test(e))
		.forEach((e) => {
			const parts = /^\| \[`(.*)`\]\(([a-z0-9-_./:#]*)\)/.exec(e);

			if (!parts) return;

			const [_, name, path] = parts;

			console.log(name, path);

			if (!found.has(name)) {
				rules.push(createRule("eslintReactXyz", name, `${BASE_URL}${path}`));
				found.add(name);
			}
		});

	return {
		name: "@eslint-react/eslint-plugin",
		rules,
	};
};
