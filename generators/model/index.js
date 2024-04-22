import chalk from "chalk"
import fs from "fs"
import Generator from "yeoman-generator"
import prompts from "./prompts.js"

export default class extends Generator {
	static displayName = "Create a new model for an existing uimodule."

	async prompting() {
		this.options.config = this.config.getAll()
		if (Object.keys(this.options.config).length === 0) {
			this.log(`${chalk.blue("We couldn't find a parent UI5 project with existing uimodules, but you can create a new one by running")} ${chalk.yellow("yo easy-ui5 project")}${chalk.blue(".")}`)
			this.cancelCancellableTasks()
		} else {
			await prompts.call(this)
		}
	}

	async writing() {
		this.log(`creating new model for ${this.options.config.uimodule}`)

		const manifestPath = `${this.options.config.uimodule}/webapp/manifest.json`
		const manifestJSON = JSON.parse(fs.readFileSync(this.destinationPath(manifestPath)))

		const dataSource = `${this.options.config.modelName || "default"}DataSource`
		const serviceUrl = new URL(this.options.config.modelUrl).pathname

		manifestJSON["sap.ui5"]["models"][this.options.config.modelName] = {}
		if (!manifestJSON["sap.app"]["dataSources"]) {
			manifestJSON["sap.app"]["dataSources"] = {}
		}

		if (this.options.config.modelType = "OData v4") {
			manifestJSON["sap.ui5"]["models"][this.options.config.modelName] = {
				dataSource: dataSource,
				preload: true,
				settings: {
					synchronizationMode: "None",
					operationMode: "Server",
					autoExpandSelect: true,
					earlyRequests: true
				}
			}
			manifestJSON["sap.app"]["dataSources"][dataSource] = {
				uri: serviceUrl,
				type: "OData",
				settings: {
					annotations: [],
					localUri: "localService/metadata.xml",
					odataVersion: "4.0"
				}
			}
		}


		fs.writeFileSync(this.destinationPath(manifestPath), JSON.stringify(manifestJSON, null, 4))
	}

}
