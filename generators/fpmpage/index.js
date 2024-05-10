import chalk from "chalk"
import fpmWriter from "@sap-ux/fe-fpm-writer"
import fs from "fs"
import Generator from "yeoman-generator"
import prompts from "./prompts.js"
import serviceWriter from "@sap-ux/odata-service-writer"
import { lookForParentUI5ProjectAndPrompt } from "../helpers.js"

export default class extends Generator {
	static displayName = "Add a page to a Fiori elements FPM application."

	async prompting() {
		await lookForParentUI5ProjectAndPrompt.call(this, prompts)
	}

	async writing() {
		this.log(chalk.green(`✨ adding a ${this.options.config.pageType} page to ${this.options.config.uimodule}`))

		// save package.json to reapply build script later (unfortunately gets overwritten by fpmWriter)
		this.options.config.oldPackageJson = JSON.parse(fs.readFileSync(this.destinationPath(`${this.options.config.uimodule}/package.json`)))

		// enable fpm
		const target = this.destinationPath(this.options.config.uimodule)
		fpmWriter.enableFPM(target, {
			replaceAppComponent: this.options.config.replaceComponent,
			typescript: this.options.config.enableTypescript || false
		}, this.fs)

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

		if (this.options.config.serviceUrl) {
			await serviceWriter.generate(uimodulePath, {
				url: this.options.config.host,
				client: this.options.config.client,
				path: this.options.config.path,
				version: serviceWriter.OdataVersion.v4,
				metadata: this.options.config.metadata,
				localAnnotationsName: "annotation"
			}, this.fs)
		}

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

	install() {
		// reapply old build script that got overwritten by fpmWriter
		const packagePath = `${this.options.config.uimodule}/package.json`
		const packageJson = JSON.parse(fs.readFileSync(this.destinationPath(packagePath)))
		packageJson["scripts"]["build"] = this.options.config.oldPackageJson["scripts"]["build"]
		fs.writeFileSync(this.destinationPath(packagePath), JSON.stringify(packageJson, null, 4))
	}

}
