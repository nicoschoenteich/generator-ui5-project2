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

	// this.options.config.serviceUrl = (await this.prompt({
	// 	type: "input",
	// 	name: "serviceUrl",
	// 	message: "What is the url of the main service?",
	// 	validate: (s) => {
	// 		if (new URL(s) instanceof Error) {
	// 			return 	// no error message required, yeoman will forward an error to the user
	// 		}
	// 		return true
	// 	}
	// })).serviceUrl

	// TO-DO: this.options.config.metadata

	this.options.config.navigation = (await this.prompt({
		type: "list",
		name: "navigation",
		message: "From what page do you want to navigate?", 
		choices: ["fakeTarget"] // Object.keys(targets) 
	})).navigation

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
}
