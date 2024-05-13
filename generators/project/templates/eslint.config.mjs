// TO-DO: we might want to use https://www.npmjs.com/package/@sap-ux/eslint-plugin-fiori-tools
// for freestyle apps as well as soon as they move to eslint version 9

import js from "@eslint/js"
import globals from "globals"

export default [
	js.configs.recommended,

	{
		rules: {
			"no-unused-vars": "warn",
			"no-undef": "warn"
		},
		languageOptions: {
			sourceType: "module",
			globals: {
				sap: true,
				...globals.browser
			}
		},
		ignores: [
			"node_modules/*"
		]
	}
]
