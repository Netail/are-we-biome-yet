export interface Plugin {
	name: string;
	rules: Rule[];
}

export interface Rule {
	source_rule_name: string;
	source_link: string;
	biome_rule_name?: string;
	biome_link?: string;
	state: "same" | "inspired" | "missing";
}
