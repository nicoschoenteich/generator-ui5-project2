import chalk from "chalk"
import fs from "fs"
import { generate as writeFPMApp } from "@sap-ux/ui5-application-writer"
import { generate as writeFreestyleApp, TemplateType } from "@sap-ux/fiori-freestyle-writer"
import Generator from "yeoman-generator"
import { lookForParentUI5ProjectAndPrompt } from "../helpers.js"
import prompts from "./prompts.js"

export default class extends Generator {
	static displayName = "Create a new uimodule within an existing OpenUI5/SAPUI5 project"

	async prompting() {
		// standalone call, this.options.config would get passed from ../project generator
		if (!this.options.config) {
			await lookForParentUI5ProjectAndPrompt.call(this, prompts)
		}
	}

	async writing() {
		this.log(chalk.green(`✨ creating new uimodule ${this.options.config.uimoduleName}`))

		// add uimodule to workspaces in package.json
		const rootPackageJson = JSON.parse(fs.readFileSync(this.destinationPath("package.json")))
		rootPackageJson.workspaces.push(this.options.config.uimoduleName)
		fs.writeFileSync(this.destinationPath("package.json"), JSON.stringify(rootPackageJson, null, 4))

		this.destinationRoot(this.destinationPath(this.options.config.uimoduleName))

		const appConfig = {
			app: {
				id: this.options.config.uimoduleName,
				title: this.options.config.tileName || this.options.config.uimoduleName,
				description: `${this.options.config.uimoduleName} description`
			},
			appOptions: {
				loadReuseLibs: true
			},
			package: {
				name: this.options.config.uimoduleName
			},
			ui5: {
				ui5Theme: "sap_horizon"
			}
		}

		// pass appConfig to @sap-ux writers
		if (this.options.config.enableFPM) {
			appConfig.appOptions.sapux = this.options.config.enableFioriTools
			appConfig.app.baseComponent = "sap/fe/core/AppComponent"
			if (this.options.config.enableTypescript) {
				appConfig.appOptions.typescript = true
			}
			await writeFPMApp(this.destinationPath(), appConfig, this.fs)
		} else {
			appConfig.template = {
				type: TemplateType.Basic,
				settings: {
					viewName: "MainView"
				}
			}
			await writeFreestyleApp(this.destinationPath(), appConfig, this.fs)
		}

		this.composeWith("./platform", { config: this.options.config })
		this.composeWith("./ui5Libs", { config: this.options.config })

		if (this.options.config.enableFPM) {
			// sometimes yeoman mixes up the order of subgenerators and
			// and calls fpmpage before enablefpm
			// this is a fix to avoid errors in case this happens 
			// const manifestJSON = JSON.parse(fs.readFileSync(this.destinationPath("webapp/manifest.json")))
			// if (!manifestJSON["sap.ui5"]["dependencies"]["libs"]["sap.fe.templates"]) {
			// 	manifestJSON["sap.ui5"]["dependencies"]["libs"]["sap.fe.templates"] = {}
			// 	fs.writeFileSync(this.destinationPath("webapp/manifest.json"), JSON.stringify(manifestJSON, null, 4))
			// }

			this.composeWith("../model", { config: this.options.config })
			this.composeWith("../enablefpm", { config: this.options.config })
			this.composeWith("../fpmpage", { config: this.options.config })
		}
	}

	install() {
		// account for use of npm workspaces (node_modules at root of project, not uimodule level)
		if (this.options.config.enableFPM && this.options.config.enableTypescript) {
			const tsconfigJson = JSON.parse(fs.readFileSync(this.destinationPath("tsconfig.json")))
			tsconfigJson.compilerOptions.typeRoots = [
				"../node_modules/@types",
				"../node_modules/@sapui5/ts-types-esm"
			]
			fs.writeFileSync(this.destinationPath("tsconfig.json"), JSON.stringify(tsconfigJson, null, 4))
		}
	}

	end() {
		// add new uimodule to .yo-rc.json
		this.destinationRoot(this.destinationPath("../"))
		if (!this.config.get("uimodules")) {
			this.config.set("uimodules", [this.options.config.uimoduleName])
		} else {
			this.config.set("uimodules", this.config.get("uimodules").concat(this.options.config.uimoduleName))
		}
		this.config.delete("uimoduleName")
		this.config.delete("tileName")
	}

}
