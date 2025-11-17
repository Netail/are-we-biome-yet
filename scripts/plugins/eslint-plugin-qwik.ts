import type { Rule } from "../../src/interfaces/rule.ts";
import type { CreateRule } from "../generator.ts";

export const fetchEslintPluginQwikRules = async (
	createRule: CreateRule,
): Promise<{ name: string; rules: Rule[] }> => {
	const rules: Rule[] = [];

	const response = await fetch(
		"https://raw.githubusercontent.com/QwikDev/qwik/refs/heads/main/packages/eslint-plugin-qwik/README.md",
	);
	const markdown = await response.text();

	const lines = markdown.split("\n");
	lines
		.filter((e) =>
			/^\| \[(.*)\]\(https:\/\/qwik\.dev\/docs\/advanced\/eslint\/#(.*)\).*/.test(
				e,
			),
		)
		.filter((e) => !e.includes("❌"))
		.forEach((e) => {
			const parts = /^\| \[`(.*)`\]\(([a-z0-9-_./:#]*)\)/.exec(e);

			if (!parts) return;

			const [_, name, url] = parts;

			rules.push(createRule("eslintQwik", name.split("/").pop() || "", url));
		});

	return {
		name: "eslint-plugin-qwik",
		rules,
	};
};
