"use client";

import clsx from "clsx";
import type { Rule } from "@/interfaces/rule";

import css from "./heatmap.module.css";

export const HeatMap = ({ rules }: { rules: Rule[] }) => {
	return (
		<div className={css.heatmap}>
			{rules.map((rule) => (
				// biome-ignore lint/a11y/useAnchorContent: no.
				<a
					key={rule.source_rule_name}
					href={rule.biome_link || rule.source_link}
					target="_blank"
					title={`${rule.source_rule_name} (${rule.biome_rule_name || "missing"})`}
					className={clsx(css.heatmapItem, css[rule.state])}
				/>
			))}
		</div>
	);
};
