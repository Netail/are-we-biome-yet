import { writeFileSync } from "node:fs";
import type { Rule } from "../src/interfaces/rule.ts"
import { parse } from 'node-html-parser';

interface BiomeMetaDataRule {
    name: string;
    link: string;
    sources?: [
        {
            kind: 'sameLogic' | 'inspired',
            source: {
                [plugin: string]: string
            }
        }
    ]
}

interface BiomeMetaData {
    lints: {
        languages: {
            [language: string]: {
                [group: string]: {
                    [rule: string]: BiomeMetaDataRule
                }
            }
        }
    }
}

type CreateRule = (plugin: string, rule: string, url: string) => Rule;

const createRuleCaller = (metaData: BiomeMetaData): CreateRule => (plugin, rule, url) => {
    for (let language of Object.values(metaData.lints.languages)) {
        for (let group of Object.values(language)) {
            for (let biomeRule of Object.values(group)) {
                if (biomeRule.sources && biomeRule.sources.length > 0) {
                    const source = biomeRule.sources.find(source => source.source[plugin] === rule);

                    if (source) {
                        return {
                            source_rule_name: rule,
                            source_link: url,
                            biome_rule_name: biomeRule.name,
                            biome_link: biomeRule.link,
                            state: source.kind === 'sameLogic' ? 'same' : 'inspired',
                        }
                    }
                }
            }
        }
    }

    return {
        source_rule_name: rule,
        source_link: url,
        state: 'missing'
    };
}

const fetchEslint = async (createRule: CreateRule): Promise<Rule[]> => {
    const response = await fetch('https://raw.githubusercontent.com/eslint/eslint/refs/heads/main/docs/src/_data/rules_meta.json');
    const eslintMeta: {
        [rule: string]: {
            deprecated?: unknown,
            docs: {
                url: string
            }
        }
    } = await response.json();

    let rules: Rule[] = [];
    for (let [rule, meta] of Object.entries(eslintMeta)) {
        if ('deprecated' in meta) continue;

        rules.push(createRule('eslint', rule, meta.docs.url));
    }

    return rules;
}

const fetchTypeScriptEslint = async (createRule: CreateRule): Promise<Rule[]> => {
    const response = await fetch('https://typescript-eslint.io/rules/');
    const tsEslintPage = await response.text();

    const html = parse(tsEslintPage);
    const table = html.querySelector('table');
    const rows = table?.querySelectorAll('tr');

    let rules: Rule[] = [];

    if (!rows || rows.length === 0) {
        return rules;
    }

    for (let row of rows) {
        if (row.toString().includes('💀')) continue;

        const path = row.querySelector('a')?.getAttribute('href');

        if (!path) continue;

        rules.push(createRule('eslintTypeScript', path.split('/').pop() || '', `https://typescript-eslint.io${path}`));
    }

    return rules;
}

const yoink = async () => {
    const response = await fetch('https://biomejs.dev/metadata/rules.json');

    if (!response.ok) {
        console.error('Failed to fetch biome metadata...');
        process.exit(1);
    }

    const biomeMetaData: BiomeMetaData = await response.json();
    const createRule = createRuleCaller(biomeMetaData);

    const eslint = await fetchEslint(createRule);
    const tsEslint = await fetchTypeScriptEslint(createRule);

    writeFileSync('./output.json', JSON.stringify({
        plugins: [
            {
                name: 'eslint',
                rules: eslint,
            },
            {
                name: 'typescript-eslint',
                rules: tsEslint,
            }
        ]
    }));
}

yoink();
