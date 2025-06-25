import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
	plugins: [preact(), tailwindcss()],
	server: { host: true },
	build: {
		"target": "es2020",
		// servir el bundle en el backend
		"outDir": "../backend/estatico"
	}
});
