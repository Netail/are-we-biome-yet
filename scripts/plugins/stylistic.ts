import { parse } from "node-html-parser";
import type { Rule } from "../../src/interfaces/rule.ts";
import type { CreateRule } from "../generator.ts";

const BASE_URL = `https://eslint.style`;

export const fetchStylisticRules = async (
    createRule: CreateRule,
): Promise<Rule[]> => {
    const rules: Rule[] = [];

    const response = await fetch(`${BASE_URL}/rules/`);
    const htmlPage = await response.text();

    const tables = htmlPage.matchAll(/<table(.*)<\/table>/g);

    for (const table of tables) {
        const html = parse(table[0]);
        const rows = html.querySelectorAll("a") || [];

        for (const row of rows) {
            const path = row.getAttribute("href");

            if (!path) continue;

            rules.push(
                createRule(
                    "eslintStylistic",
                    path.split("/").pop() || "",
                    `${BASE_URL}${path}`,
                ),
            );
        }
    }

    return rules;
};
