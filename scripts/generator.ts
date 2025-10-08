import { writeFileSync } from "node:fs";
import type { Rule } from "../src/interfaces/rule.ts";
import { fetchEslintRules } from "./plugins/eslint.ts";
import { fetchEslintPluginImportRules } from "./plugins/eslint-plugin-import.ts";
import { fetchEslintPluginJestRules } from "./plugins/eslint-plugin-jest.ts";
import { fetchEslintPluginJSXA11YRules } from "./plugins/eslint-plugin-jsx-a11y.ts";
import { fetchEslintPluginReactRules } from "./plugins/eslint-plugin-react.ts";
import { fetchEslintPluginReactHooksRules } from "./plugins/eslint-plugin-react-hooks.ts";
import { fetchEslintPluginUnicornRules } from "./plugins/eslint-plugin-unicorn.ts";
import { fetchEslintPluginVitestRules } from "./plugins/eslint-plugin-vitest.ts";
import { fetchEslintPluginVueRules } from "./plugins/eslint-plugin-vue.ts";
import { fetchGraphqlEslintRules } from "./plugins/graphql-eslint.ts";
import { fetchStylelintRules } from "./plugins/stylelint.ts";
import { fetchStylisticRules } from "./plugins/stylistic.ts";
import { fetchTypeScriptEslintRules } from "./plugins/typescript-eslint.ts";

export interface BiomeMetaDataRule {
	name: string;
	link: string;
	sources?: [
		{
			kind: "sameLogic" | "inspired";
			source: {
				[plugin: string]: string;
			};
		},
	];
}

export interface BiomeMetaData {
	lints: {
		languages: {
			[language: string]: {
				[group: string]: {
					[rule: string]: BiomeMetaDataRule;
				};
			};
		};
	};
}

export type CreateRule = (plugin: string, rule: string, url: string) => Rule;

const createRuleCaller =
	(metaData: BiomeMetaData): CreateRule =>
		(plugin, rule, url) => {
			for (const language of Object.values(metaData.lints.languages)) {
				for (const group of Object.values(language)) {
					for (const biomeRule of Object.values(group)) {
						if (biomeRule.sources && biomeRule.sources.length > 0) {
							const source = biomeRule.sources.find(
								(source) => source.source[plugin] === rule,
							);

							if (source) {
								return {
									source_rule_name: rule,
									source_link: url,
									biome_rule_name: biomeRule.name,
									biome_link: biomeRule.link,
									state: source.kind === "sameLogic" ? "same" : "inspired",
								};
							}
						}
					}
				}
			}

			return {
				source_rule_name: rule,
				source_link: url,
				state: "missing",
			};
		};

const yoink = async () => {
	const response = await fetch("https://biomejs.dev/metadata/rules.json");

	if (!response.ok) {
		console.error("Failed to fetch biome metadata...");
		process.exit(1);
	}

	const biomeMetaData: BiomeMetaData = await response.json();
	const createRule = createRuleCaller(biomeMetaData);

	const eslint = await fetchEslintRules(createRule);
	console.log("eslint: ", eslint.length);

	const tsEslint = await fetchTypeScriptEslintRules(createRule);
	console.log("typescript-eslint: ", tsEslint.length);

	const stylelint = await fetchStylelintRules(createRule);
	console.log("stylelint: ", stylelint.length);

	const eslintPluginReact = await fetchEslintPluginReactRules(createRule);
	console.log("eslint-plugin-react: ", eslintPluginReact.length);

	const eslintPluginReactHooks =
		await fetchEslintPluginReactHooksRules(createRule);
	console.log("eslint-plugin-react-hooks: ", eslintPluginReactHooks.length);

	const a11yEslint = await fetchEslintPluginJSXA11YRules(createRule);
	console.log("eslint-plugin-jsx-a11y: ", a11yEslint.length);

	const unicornEslint = await fetchEslintPluginUnicornRules(createRule);
	console.log("graphql-plugin-unicorn: ", unicornEslint.length);

	const graphqlEslint = await fetchGraphqlEslintRules(createRule);
	console.log("graphql-eslint: ", graphqlEslint.length);

	const jestEslint = await fetchEslintPluginJestRules(createRule);
	console.log("eslint-plugin-jest: ", jestEslint.length);

	const vitestEslint = await fetchEslintPluginVitestRules(createRule);
	console.log("eslint-plugin-vitest: ", vitestEslint.length);

	const importEslint = await fetchEslintPluginImportRules(createRule);
	console.log("eslint-plugin-import: ", importEslint.length);

	const vueEslint = await fetchEslintPluginVueRules(createRule);
	console.log("eslint-plugin-vue: ", vueEslint.length);

	const importStylistic = await fetchStylisticRules(createRule);
	console.log("stylistic: ", importStylistic.length);

	writeFileSync(
		"./output.json",
		JSON.stringify({
			plugins: [
				{
					name: "eslint",
					rules: eslint,
				},
				{
					name: "typescript-eslint",
					rules: tsEslint,
				},
				{
					name: "stylelint",
					rules: stylelint,
				},
				{
					name: "eslint-plugin-react",
					rules: eslintPluginReact,
				},
				{
					name: "eslint-plugin-react-hooks",
					rules: eslintPluginReactHooks,
				},
				{
					name: "eslint-plugin-jsx-a11y",
					rules: a11yEslint,
				},
				{
					name: "eslint-plugin-unicorn",
					rules: unicornEslint,
				},
				{
					name: "@graphql-eslint/eslint-plugin",
					rules: graphqlEslint,
				},
				{
					name: "eslint-plugin-jest",
					rules: jestEslint,
				},
				{
					name: "eslint-plugin-vitest",
					rules: vitestEslint,
				},
				{
					name: "eslint-plugin-import",
					rules: importEslint,
				},
				{
					name: "eslint-plugin-vue",
					rules: vueEslint,
				},
				{
					name: "@stylistic/eslint-plugin",
					rules: importStylistic,
				},
			],
		}),
	);
};

yoink();
