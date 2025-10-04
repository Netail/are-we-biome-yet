import { HeatMap } from "@/components/heatmap";
import type { Plugin } from "@/interfaces/rule";
import { importOutput } from "@/utils/importer";

import css from "./page.module.css";

const Page = async () => {
	const plugins: Plugin[] = await importOutput();

	const rules = plugins.flatMap(e => e.rules);
	const totalRules = rules.length;
	const availableRules = rules.filter(e => e.state !== 'missing').length;
	const percentage = Math.round(Math.max((availableRules / totalRules) * 100));

	return (
		<div className={css.container}>
			<h1>Are We Biome Yet?</h1>
			<p>{availableRules} of {totalRules} rules have been implemented ({percentage}%)</p>

			{plugins.map((plugin) => {
				const pluginTotalRules = plugin.rules.length;
				const pluginAvailableRules = plugin.rules.filter(e => e.state !== 'missing').length;
				const pluginPercentage = Math.round(Math.max((pluginAvailableRules / pluginTotalRules) * 100));

				return (
					<details className={css.group} key={plugin.name} open>
						<summary><h2>{plugin.name} ({pluginAvailableRules} / {pluginTotalRules} - {pluginPercentage || 0}%{pluginPercentage === 100 ? ' 🎉' : ''})</h2></summary>
						<HeatMap rules={plugin.rules} />
					</details>
				)
			})}
		</div>
	);
};

export default Page;
