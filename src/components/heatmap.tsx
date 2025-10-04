'use client';

import { Rule } from "@/interfaces/rule"
import clsx from "clsx";

import css from './heatmap.module.css';

export const HeatMap = ({ rules }: { rules: Rule[] }) => {
    return (
        <div className={css.heatmap}>
            {rules.map(rule => (
                <a key={rule.source_rule_name} href={rule.biome_link || rule.source_link} target="_blank" title={`${rule.source_rule_name} (${rule.biome_rule_name || 'missing'})`} className={clsx(css.heatmapItem, css[rule.state])} />
            ))}
        </div>
    )
}
