import { HeatMap } from "@/components/heatmap";
import { Plugin } from "@/interfaces/rule";
import { importOutput } from "@/utils/importer";

import css from './page.module.css';

const Page = async () => {
  const plugins: Plugin[] = await importOutput();

  return (
    <div className={css.container}>
      <h1>Are We Biome Yet?</h1>

      {plugins.map(plugin => (
        <div key={plugin.name}>
          <h2>{plugin.name}</h2>
          <HeatMap rules={plugin.rules}/>
        </div>
      ))}
    </div>
  );
}

export default Page;
