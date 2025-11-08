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

	const plugins = [
		await fetchEslintRules(createRule),
		await fetchTypeScriptEslintRules(createRule),
		await fetchStylelintRules(createRule),
		await fetchEslintPluginReactRules(createRule),
		await fetchEslintPluginReactHooksRules(createRule),
		await fetchEslintPluginJSXA11YRules(createRule),
		await fetchEslintPluginUnicornRules(createRule),
		await fetchGraphqlEslintRules(createRule),
		await fetchEslintPluginJestRules(createRule),
		await fetchEslintPluginVitestRules(createRule),
		await fetchEslintPluginImportRules(createRule),
		await fetchEslintPluginVueRules(createRule),
		await fetchStylisticRules(createRule),
	];

	plugins.forEach(plugin => console.log(`${plugin.name}: ${plugin.rules.length}`))

	writeFileSync(
		"./output.json",
		JSON.stringify({
			plugins,
		}),
	);
};

yoink();
