import type { Rule } from "../../src/interfaces/rule.ts";
import type { CreateRule } from "../generator.ts";

export const fetchEslintRules = async (
	createRule: CreateRule,
): Promise<Rule[]> => {
	const rules: Rule[] = [];

	const response = await fetch(
		"https://raw.githubusercontent.com/eslint/eslint/refs/heads/main/docs/src/_data/rules_meta.json",
	);
	const eslintMeta: {
		[rule: string]: {
			deprecated?: unknown;
			docs: {
				url: string;
			};
		};
	} = await response.json();

	for (const [rule, meta] of Object.entries(eslintMeta)) {
		if ("deprecated" in meta) continue;

		rules.push(createRule("eslint", rule, meta.docs.url));
	}

	return rules;
};
