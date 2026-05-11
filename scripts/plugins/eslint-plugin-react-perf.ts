import type { Rule } from "../../src/interfaces/rule.ts";
import type { CreateRule } from "../generator.ts";

export const fetchEslintPluginReactPerfRules = async (
	createRule: CreateRule,
): Promise<{ name: string; rules: Rule[] }> => {
	const rules: Rule[] = [];

	const response = await fetch(
		"https://raw.githubusercontent.com/cvazac/eslint-plugin-react-perf/refs/heads/master/README.md",
	);
	const markdown = await response.text();

	const lines = markdown.split("\n");
	const found = new Set();
	lines
		.filter((e) => /^- \[(.*)\]\(docs\/rules\/(.*)\.md\).*/.test(e))
		.forEach((e) => {
			const parts = /^- \[(.*)\]\(([a-z0-9-_./:#]*)\)/.exec(e);

			if (!parts) return;

			const [_, name, path] = parts;

			if (!found.has(name)) {
				rules.push(
					createRule(
						"eslintReactPerf",
						name,
						`https://github.com/cvazac/eslint-plugin-react-perf/blob/master/${path}`,
					),
				);
				found.add(name);
			}
		});

	return {
		name: "eslint-plugin-react-perf",
		rules,
	};
};
