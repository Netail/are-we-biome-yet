import { type Document, Window } from "happy-dom";

export const parse = (raw: string): Document => {
	const window = new Window({
		settings: {
			disableJavaScriptFileLoading: true,
			disableCSSFileLoading: true,
			enableFileSystemHttpRequests: false,
		},
	});
	const domParser = new window.DOMParser();

	return domParser.parseFromString(raw, "text/html");
};
