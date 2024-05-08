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

		const target = this.destinationPath(this.options.config.uimodule)
		switch (this.options.config.pageType) {
			case "object":
				fpmWriter.generateObjectPage(target, { entity: this.options.config.mainEntity, navigation: this.config.options.navigation }, this.fs)
				break;
			case "list report":
				fpmWriter.generateListReport(target, { entity: this.options.config.mainEntity }, this.fs)
				break
			default:
				if (this.options.config.enableTypescript === undefined) {
					this.options.config.enableTypescript = isTypescriptEnabled(target, this.fs)
				}
				fpmWriter.generateCustomPage(target, {
					name: this.options.config.viewName,
					entity: this.options.config.mainEntity,
					navigation: this.options.config.navigation,
					typescript: this.options.config.enableTypescript
				}, this.fs)
				break
		}
	}

}
