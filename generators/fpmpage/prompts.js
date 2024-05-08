import fs from "fs"

export default async function prompts() {

	// this subgenerator might be called before uimodules array gets created during end() as part of ../uimodule/index.js
	if (!this.options.config.uimodules) {
		this.options.config.uimodule = this.options.config.uimoduleName
	} else if (this.options.config.uimodules?.length === 1) {
		this.options.config.uimodule = this.options.config.uimodules[0]
	} else {
		this.options.config.uimodule = (await this.prompt({
			type: "list",
			name: "uimodule",
			message: "To which uimodule do you want to add a new FPM page?",
			choices: this.options.config.uimodules
		})).uimodule
	}

	// TO-DO: not allow object page if list report is not already in place
	this.options.config.pageType = (await this.prompt({
		type: "list",
		name: "pageType",
		message: "What type of page should be used for the main page?",
		choices: [
			{ value: "custom", name: "Custom Page", },
			{ value: "list report", name: "List Report" },
			{ value: "object", name: "Object Page" }],
		default: "custom"
	})).pageType

	// TO-DO: this.options.config.metadata

	const manifestPath = `${this.options.config.uimodule}/webapp/manifest.json`
	const manifestJSON = JSON.parse(fs.readFileSync(this.destinationPath(manifestPath)))
	const targets = manifestJSON["sap.ui5"]?.["routing"]?.["targets"]
	this.options.config.navigationSourcePage = (await this.prompt({
		type: "list",
		name: "navigationSourcePage",
		message: "From what page do you want to navigate?",
		choices: Object.keys(targets),
		when: Object.keys(targets).length > 0
	})).navigationSourcePage

	this.options.config.mainEntity = (await this.prompt({
		type: "input",
		name: "mainEntity",
		message: "What entity should be used for the new page?",
		// TO-DO: create method in ../helpers.js for this kind of stuff
		validate: (s) => {
			if (/^\d*[a-zA-Z][a-zA-Z0-9]*$/g.test(s)) {
				return true
			}
			return "Please use alpha numeric characters only."
		}
	})).mainEntity

	this.options.config.viewName = (await this.prompt({
		type: "input",
		name: "viewName",
		message: "How do you want to name your custom page view?",
		validate: (s) => {
			if (/^\d*[a-zA-Z][a-zA-Z0-9]*$/g.test(s)) {
				return true
			}
			return "Please use alpha numeric characters only."
		},
		when: this.options.config.pageType === "custom",
		default: "Main"
	})).viewName

}
