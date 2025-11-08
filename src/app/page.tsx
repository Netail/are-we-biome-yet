import { HeatMap } from "@/components/heatmap";
import type { Plugin } from "@/interfaces/rule";
import { calculate } from "@/utils/calculate";
import { importOutput } from "@/utils/importer";

import css from "./page.module.css";

const Page = async () => {
	const plugins: Plugin[] = await importOutput();

	const rules = plugins.flatMap((e) => e.rules);
	const { total, available, percentage } = calculate(rules);

	return (
		<div className={css.container}>
			<h1>Are We Biome Yet?</h1>
			<p>
				{available} of {total} rules have been implemented ({percentage}%)
			</p>

			{plugins.map((plugin) => {
				const { total, available, percentage } = calculate(plugin.rules);

				return (
					<details className={css.group} key={plugin.name} open>
						<summary>
							<h2>
								{plugin.name} ({available} / {total} - {percentage}%
								{percentage === 100 ? " 🎉" : ""})
							</h2>
						</summary>
						<HeatMap rules={plugin.rules} />
					</details>
				);
			})}
		</div>
	);
};

export default Page;
