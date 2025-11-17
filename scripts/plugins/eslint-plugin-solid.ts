import type { Rule } from "../../src/interfaces/rule.ts";
import type { CreateRule } from "../generator.ts";

export const fetchEslintPluginSolidRules = async (
	createRule: CreateRule,
): Promise<{ name: string; rules: Rule[] }> => {
	const rules: Rule[] = [];

	const response = await fetch(
		`https://raw.githubusercontent.com/solidjs-community/eslint-plugin-solid/refs/heads/main/packages/eslint-plugin-solid/README.md`,
	);
	const markdown = await response.text();

	const lines = markdown.split("\n");
	lines
		.filter((e) =>
			/\| \[(.*)\]\(\/packages\/eslint-plugin-solid\/docs\/(.*)\.md\).*/.test(
				e,
			),
		)
		.filter((e) => !e.includes("❌"))
		.forEach((e) => {
			const parts = /\| \[(.*)\]\(([a-z0-9-_./:#]*)\)/.exec(e);

			if (!parts) return;

			const [_, name, path] = parts;

			rules.push(
				createRule(
					"eslintSolid",
					name.split("/").pop() || "",
					`https://github.com/solidjs-community/eslint-plugin-solid/tree/main${path}`,
				),
			);
		});

	return {
		name: "eslint-plugin-solid",
		rules,
	};
};
