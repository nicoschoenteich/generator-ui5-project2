import chalk from "chalk"
import fpmWriter from "@sap-ux/fe-fpm-writer"
import fs from "fs"
import Generator from "yeoman-generator"
import prompts from "./prompts.js"
import { lookForParentUI5ProjectAndPrompt } from "../helpers.js"
import yaml from "yaml"

export default class extends Generator {
	static displayName = "Enable the Fiori elements flexible programming model for an existing uimodule."

	async prompting() {
		await lookForParentUI5ProjectAndPrompt.call(this, prompts)
	}

	async writing() {
		this.log(chalk.green(`✨ enabling the Fiori elements flexible programming model for ${this.options.config.uimodule}`))

		// TO-DO: What's with the replaceAppComponent option?
		// TO-DO: Throw error if project doesn't meet FPM requirements, for example when using cdn

		const target = this.destinationPath(this.options.config.uimodule)
		fpmWriter.enableFPM(target, {
			replaceAppComponent: this.options.config.replaceComponent,
			typescript: this.options.config.enableTypescript || false // option might not be configured if enablefpm is called standalone after non-fpm project has been generated
		}, this.fs) 

		const ui5YamlPath = `${this.options.config.uimodule}/ui5.yaml`
		const ui5Yaml = yaml.parse(fs.readFileSync(this.destinationPath(ui5YamlPath)).toString())
		ui5Yaml.framework.libraries.push({
			name: "sap.fe.templates"
		})
		this.writeDestination(this.destinationPath(ui5YamlPath), yaml.stringify(ui5Yaml))
	}

}
