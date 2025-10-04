import type { Plugin } from "@/interfaces/rule";

export const importOutput = async (): Promise<Plugin[]> => {
	const { plugins } = await import("../../output.json");
	return plugins as Plugin[];
};
