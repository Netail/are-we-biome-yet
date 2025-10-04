import type { Rule } from "../../src/interfaces/rule.ts";
import type { CreateRule } from "../generator.ts";

export const fetchEslintPluginJSXA11YRules = async (
    createRule: CreateRule,
): Promise<Rule[]> => {
    const rules: Rule[] = [];

    const response = await fetch(
        `https://raw.githubusercontent.com/jsx-eslint/eslint-plugin-jsx-a11y/refs/heads/main/README.md`,
    );
    const markdown = await response.text();

    const lines = markdown.split("\n");
    lines
        .filter((e) => /^\| \[(.*)\]\(docs\/rules\/(.*)\.md\).*/.test(e))
        .filter((e) => !e.includes("❌"))
        .forEach((e) => {
            const parts = /^\| \[(.*)\]\(([a-z0-9-_./]*)\)/.exec(e);

            if (!parts) return;

            const [_, name, path] = parts;

            rules.push(
                createRule("eslintJsxA11y", name, `https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/${path}`),
            );
        });

    return rules;
};
