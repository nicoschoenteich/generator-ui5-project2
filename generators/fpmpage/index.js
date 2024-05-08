import chalk from "chalk"
import fpmWriter from "@sap-ux/fe-fpm-writer"
import fs from "fs"
import Generator from "yeoman-generator"
import prompts from "./prompts.js"
import { lookForParentUI5ProjectAndPrompt } from "../helpers.js"

export default class extends Generator {
	static displayName = "Add a page to a Fiori elements FPM application."

	async prompting() {
		await lookForParentUI5ProjectAndPrompt.call(this, prompts)
	}

	async writing() {
		this.log(chalk.green(`✨ adding a ${this.options.config.pageType} page to ${this.options.config.uimodule}`))

		const manifestPath = `${this.options.config.uimodule}/webapp/manifest.json`
		const manifestJSON = JSON.parse(fs.readFileSync(this.destinationPath(manifestPath)))
		const targets = manifestJSON["sap.ui5"]?.["routing"]?.["targets"]
		let navigation
		// navigation to new page only relevant if at least one target already exist
		if (Object.keys(targets).length > 0) {
			navigation = {
				sourcePage: this.options.config.navigationSourcePage,
				navEntity: this.options.config.mainEntity,
				navKey: true
			}
		}

		const uimodulePath = this.destinationPath(this.options.config.uimodule)
		switch (this.options.config.pageType) {
			case "object":
				fpmWriter.generateObjectPage(uimodulePath, {
					entity: this.options.config.mainEntity,
					navigation: navigation
				}, this.fs)
				break;
			case "list report":
				fpmWriter.generateListReport(uimodulePath, {
					entity: this.options.config.mainEntity
				}, this.fs)
				break
			default:
				fpmWriter.generateCustomPage(uimodulePath, {
					name: this.options.config.viewName,
					entity: this.options.config.mainEntity,
					navigation: navigation,
					typescript: this.options.config.enableTypescript
				}, this.fs)
				break
		}
	}

}
