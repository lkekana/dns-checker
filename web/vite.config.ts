import { promises as fs } from "fs";
import react from "@vitejs/plugin-react-swc";
import UnoCSS from "unocss/vite";
import type { ResolvedConfig, Plugin } from "vite";
import { defineConfig } from "vite";
import unoConfig from "./unocss";
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const neutralino = (): Plugin => {
	let config: ResolvedConfig;
	return {
		name: "neutralino",
		configResolved(resolvedConfig) {
			config = resolvedConfig;
		},
		async transformIndexHtml(html) {
			if (config.mode === "development") {
				// type AuthFileType = { nlPort: number; nlToken: string; nlConnectToken: string };
				// const authFileContent = Bun.file('../.tmp/auth_info.json');
				// const { nlPort } = await authFileContent.json();
				const authFileString = await fs.readFile(
					"../.tmp/auth_info.json",
					"utf-8",
				);
				const authFileContent = JSON.parse(authFileString);
				const { nlPort } = authFileContent;
				return html.replace(
					"<neutralino>",
					`<script src="http://localhost:${nlPort}/__neutralino_globals.js"></script>`,
				);
			}
			return html.replace(
				"<neutralino>",
				'<script src="%PUBLIC_URL%/__neutralino_globals.js"></script>',
			);
		},
	};
};

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [UnoCSS(unoConfig), react(), neutralino(), nodePolyfills({protocolImports: true})],
	server: {
		port: 3000,
		strictPort: true,
	},
});
