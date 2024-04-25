import chalk from "chalk"
import fs from "fs"
import Generator from "yeoman-generator"
import prompts from "./prompts.js"
import yaml from "yaml"
import { lookForParentUI5ProjectAndPrompt } from "../helpers.js"

export default class extends Generator {
	static displayName = "Create a new xml view for an existing uimodule."

	async prompting() {
		await lookForParentUI5ProjectAndPrompt.call(this, prompts)
	}

	async writing() {
		this.log(`creating new view for ${this.options.config.uimodule}`)

		// const manifestPath = `${this.options.config.uimodule}/webapp/manifest.json`
		// const manifestJSON = JSON.parse(fs.readFileSync(this.destinationPath(manifestPath)))

		// const dataSource = `${this.options.config.modelName || "default"}DataSource`

		// let serviceUrl
		// if (this.options.config.modelUrl) {
		// 	serviceUrl = new URL(this.options.config.modelUrl)
		// 	serviceUrl.pathname = serviceUrl.pathname + (serviceUrl.pathname.endsWith("/") ? "" : "/")
		// }

		// manifestJSON["sap.ui5"]["models"][this.options.config.modelName] = {}
		// if (!manifestJSON["sap.app"]["dataSources"]) {
		// 	manifestJSON["sap.app"]["dataSources"] = {}
		// }

		// if (this.options.config.modelType === "JSON") {

		// 	this.log(chalk.yellow("Please note: For JSON models, you have to add the data source uri in the manifest.json yourself."))

		// 	manifestJSON["sap.app"]["dataSources"][dataSource] = {
		// 		uri: "<REPLACE-WITH-URI>",
		// 		type: "JSON",
		// 	}
		// 	manifestJSON["sap.ui5"]["models"][this.options.config.modelName] = {
		// 		dataSource: dataSource,
		// 		type: "sap.ui.model.json.JSONModel"
		// 	}
		// }

		// if (this.options.config.modelType === "OData v2") {
		// 	manifestJSON["sap.app"]["dataSources"][dataSource] = {
		// 		uri: serviceUrl.pathname,
		// 		type: "OData",
		// 		settings: {
		// 			annotations: [],
		// 			localUri: "localService/metadata.xml",
		// 			odataVersion: "2.0"
		// 		}
		// 	}
		// 	manifestJSON["sap.ui5"]["models"][this.options.config.modelName] = {
		// 		dataSource: dataSource,
		// 		preload: true,
		// 		settings: {}
		// 	}
		// }

		// if (this.options.config.modelType === "OData v4") {
		// 	manifestJSON["sap.app"]["dataSources"][dataSource] = {
		// 		uri: serviceUrl.pathname,
		// 		type: "OData",
		// 		settings: {
		// 			annotations: [],
		// 			localUri: "localService/metadata.xml",
		// 			odataVersion: "4.0"
		// 		}
		// 	}
		// 	manifestJSON["sap.ui5"]["models"][this.options.config.modelName] = {
		// 		dataSource: dataSource,
		// 		preload: true,
		// 		settings: {
		// 			synchronizationMode: "None",
		// 			operationMode: "Server",
		// 			autoExpandSelect: true,
		// 			earlyRequests: true
		// 		}
		// 	}
		// }

		// // use native yeoman methods for this subgenerator as this prompts the user before overwriting
		// this.writeDestinationJSON(this.destinationPath(manifestPath), manifestJSON, null, 4)

		// // set up proxy
		// if (this.options.config.modelType.includes("OData")) {
		// 	if (this.options.config.setupProxy) {
		// 		const ui5YamlPath = `${this.options.config.uimodule}/ui5.yaml`
		// 		const ui5Yaml = yaml.parse(fs.readFileSync(this.destinationPath(ui5YamlPath)).toString())
		// 		if (!ui5Yaml.server) {
		// 			ui5Yaml.server = {
		// 				customMiddleware: []
		// 			}
		// 		}
		// 		let proxyAlreadySetup = false
		// 		for (let i = 0; i < ui5Yaml.server.customMiddleware.length; i++) {
		// 			if (ui5Yaml.server.customMiddleware[i].name === "fiori-tools-proxy") {
		// 				if (!ui5Yaml.server.customMiddleware[i].configuration.backend) {
		// 					ui5Yaml.server.customMiddleware[i].configuration.backend = []
		// 				}
		// 				ui5Yaml.server.customMiddleware[i].configuration.backend.push({
		// 					path: serviceUrl.pathname,
		// 					url: serviceUrl.origin
		// 				})
		// 				proxyAlreadySetup = true
		// 			}
		// 		}
		// 		if (!proxyAlreadySetup) {
		// 			ui5Yaml.server.customMiddleware.push({
		// 				name: "fiori-tools-proxy",
		// 				afterMiddleware: "compression",
		// 				configuration: {
		// 					backend: [
		// 						{
		// 							path: serviceUrl.pathname,
		// 							url: serviceUrl.origin
		// 						}
		// 					]
		// 				}
		// 			})
		// 		}
		// 		this.writeDestination(this.destinationPath(ui5YamlPath), yaml.stringify(ui5Yaml))
		// 	}
		// }
	}

}
